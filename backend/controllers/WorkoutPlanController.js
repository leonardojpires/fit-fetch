import db from "../models/index.mjs";
import validateWorkoutPlanParams from "../validators/workoutPlanValidator.js";

const { PlanoTreino, Exercicio, ExerciciosPlano } = db;

const tWorkoutType = {
  calisthenics: "Calistenia",
  weightlifting: "Musculação",
  cardio: "Cardio",
};

const tLevel = {
  beginner: "Iniciante",
  intermediate: "Intermédio",
  advanced: "Avançado",
};

class WorkoutPlanController {
  static async getAllWorkoutPlans(req, res) {
    try {
      const userId = req.user.id;

      const plans = await PlanoTreino.findAll({
        where: { is_saved: true, user_id: userId }
      });
      return res.status(200).json(plans);
    } catch (err) {
      // console.error("Erro ao obter planos de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getWorkoutPlanById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // It fetches the workout plan by its ID, including the associated exercises through many-to-many relationship
      // The 'include' is the JOIN operation to get related exercises
      // The 'through' options specifies that we don't want any attributes rom the JOIN table
      const plan = await PlanoTreino.findOne({
        where: { id, user_id: userId },
        include: [
          {
            model: Exercicio,
            as: "exercises",
            through: { attributes: [] },
          },
        ],
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de treino não encontrado!" });

      return res.status(200).json({ plan });
    } catch (err) {
      // console.error("Erro ao obter plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getUserWorkoutPlans(req, res) {
    try {
      const userId = req.user.id;

      const plans = await PlanoTreino.findAll({
        where: { user_id: userId, is_saved: true },
        include: [
          {
            model: Exercicio,
            as: "exercises",
            through: { attributes: [] },
          },
        ],
      });

      return res.status(200).json({ plans });
    } catch (err) {
      // console.error("Erro ao obter planos de treino do utilizador: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async generateWorkoutPlan(req, res) {
    let transaction;
    try {
      // ============================================
      // 1. INITIALIZE TRANSACTION & VALIDATE INPUT
      // ============================================
      transaction = await db.sequelize.transaction();
      const { errors, normalized } = validateWorkoutPlanParams(req.body);
      if (errors.length > 0) {
        await transaction.rollback();
        return res.status(422).json({ errors });
      }

      // ============================================
      // 2. FETCH & FILTER EXERCISES BY CRITERIA
      // ============================================
      let selectedExercises = [];
      if (normalized.workoutType !== "cardio") {
        const allExercises = await Exercicio.findAll({
          where: {
            type: normalized.workoutType,
            muscle_group: normalized.muscles,
          },
        });
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        const difficulty = difficultyOrder[normalized.level];
        const filteredExercises = allExercises.filter(
          (ex) => difficultyOrder[ex.difficulty] <= difficulty
        );
        const shuffled = filteredExercises.sort(() => Math.random() - 0.5);
        const covered = [];
        for (const muscle of normalized.muscles) {
          const exercise = shuffled.find(
            (e) => e.muscle_group === muscle && !covered.includes(e)
          );
          if (exercise) covered.push(exercise);
        }
        for (const ex of shuffled) {
          if (covered.length >= normalized.exercises_number) break;
          if (!covered.includes(ex)) covered.push(ex);
        }
        selectedExercises = covered;
      } else {
        selectedExercises = await Exercicio.findAll({
          where: { type: "cardio", difficulty: normalized.level },
        });
      }

      // ============================================
      // 3. VALIDATE EXERCISE SELECTION
      // ============================================
      if (
        selectedExercises.length === 0 &&
        normalized.workoutType !== "cardio"
      ) {
        await transaction.rollback();
        return res.status(422).json({
          errors: [
            {
              field: "exercises_number",
              message: `Nenhum exercício encontrado para os critérios selecionados (tipo: ${
                normalized.workoutType
              }, músculos: ${normalized.muscles.join(", ")})`,
            },
          ],
        });
      }

      // ============================================
      // 4. DELETE PREVIOUS UNSAVED PLANS
      // ============================================
      const currentUserId = req.user?.id || null;
      if (currentUserId) {
        const existingPlans = await PlanoTreino.findAll({
          where: { user_id: currentUserId, is_saved: false },
          attributes: ["id"],
          transaction,
        });
        const planIds = existingPlans.map((p) => p.id);
        if (planIds.length) {
          await ExerciciosPlano.destroy({
            where: { plano_id: planIds },
            transaction,
          });
          await PlanoTreino.destroy({
            where: { user_id: currentUserId, is_saved: false },
            transaction,
          });
        }
      }

      // ============================================
      // 5. CREATE NEW WORKOUT PLAN
      // ============================================
      const newPlan = await PlanoTreino.create(
        {
          user_id: req.user?.id || null,
          name: `Plano ${tWorkoutType[normalized.workoutType]} - ${new Date().toLocaleDateString('pt-PT')}`,
          description: `Plano de treino do tipo ${normalized.workoutType} para nível ${normalized.level}`,
          workout_type: normalized.workoutType,
          level: normalized.level,
          exercises_number:
            normalized.workoutType === "cardio" ? 0 : selectedExercises.length,
          duration: normalized.duration || null,
          muscles:
            normalized.workoutType === "cardio" ? [] : normalized.muscles,
          rest_time:
            normalized.workoutType === "cardio" ? 0 : normalized.rest_time ?? 0,
          series_number:
            normalized.workoutType === "cardio"
              ? 0
              : normalized.series_number ?? 0,
          reps_number:
            normalized.workoutType === "cardio"
              ? 0
              : normalized.reps_number ?? 0,
          is_saved: false,
        },
        { transaction }
      );

      // ============================================
      // 6. ASSOCIATE EXERCISES WITH PLAN
      // ============================================
      if (normalized.workoutType !== "cardio" && selectedExercises.length > 0) {
        for (const exercise of selectedExercises) {
          await ExerciciosPlano.create(
            { plano_id: newPlan.id, exercicio_id: exercise.id },
            { transaction }
          );
        }
      }

      // ============================================
      // 7. COMMIT TRANSACTION & RETURN RESPONSE
      // ============================================
      await transaction.commit();

      return res.status(201).json({
        message: "Plano de treino gerado com sucesso!",
        plan: {
          id: newPlan.id,
          name: newPlan.name,
          workout_type: newPlan.workout_type,
          level: newPlan.level,
          exercises_number: newPlan.exercises_number,
          duration: newPlan.duration,
          muscles: newPlan.muscles,
          rest_time: newPlan.rest_time,
          series_number: newPlan.series_number,
          reps_number: newPlan.reps_number,
          exercises: selectedExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            muscle_group: ex.muscle_group,
            difficulty: ex.difficulty,
          })),
        },
      });
    } catch (err) {
      // ============================================
      // 8. ERROR HANDLING & ROLLBACK
      // ============================================
      // console.error("Erro ao gerar plano de treino: ", err);
      if (transaction) {
        try {
          await transaction.rollback();
        } catch (rollbackErr) {
          // console.error("Falha ao fazer rollback: ", rollbackErr);
        }
      }
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async saveWorkoutPlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const plan = await PlanoTreino.findOne({
        where: { id, user_id: userId },
      });

      if (!plan) return res .status(404).json({ message: "Plano de treino não encontrado!" });

      const newSavedState = !plan.is_saved;
      await plan.update({ is_saved: newSavedState })

      const message = newSavedState ? "Plano de treino guardado com sucesso na tua conta!" : "Plano de treino removido dos teus guardados com sucesso!";

      return res.status(200).json({
        message,
        plan,
        is_saved: newSavedState
      });
      
    } catch (err) {
      // console.error("Erro ao guardar plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async deleteWorkoutPlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const plan = await PlanoTreino.findOne({
        where: { id: id, user_id: userId }
      });

      if (!plan) return res.status(404).json({ message: "Plano de treino não encontrado!"});

      await ExerciciosPlano.destroy({
        where: { plano_id: id }
      });

      await plan.destroy();

      return res.status(200).json({ message: "Plano de treino eliminado com sucesso!" });

    } catch(err) {
      // console.error("Erro ao eliminar plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}

export default WorkoutPlanController;
