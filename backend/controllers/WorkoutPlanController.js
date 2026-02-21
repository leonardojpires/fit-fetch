import db from "../models/index.mjs";
import validateWorkoutPlanParams from "../validators/workoutPlanValidator.js";
import { roundRobinDistribute } from "./../services/workoutDisitrubtionService.js";

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
        where: { is_saved: true, user_id: userId },
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
      // STEP 1) Start database transaction
      // ============================================

      transaction = await db.sequelize.transaction();
      if (!transaction)
        return res.status(500).json({ message: "Erro ao iniciar transação" });

      // ============================================
      // STEP 2) Validate and normalize request payload
      // ============================================

      const userId = req.user.id;
      const { errors, normalized } = validateWorkoutPlanParams(req.body);
      if (errors.length > 0) {
        await transaction.rollback(); // Rollback transaction on validation failure
        return res
          .status(422)
          .json({ message: "Parâmetros de plano de treino inválidos", errors });
      }

      console.log("Normalized input:", normalized);

      // ============================================
      // STEP 3) Fetch candidate exercises by criteria
      // ============================================

      // We're using 'let' instead of 'const' because candidateExcercises wull be reassigned basde on the workout type (cardio vs. non-cardio)
      let candidateExercises;
      if (normalized.workoutType !== "cardio") {
        candidateExercises = await Exercicio.findAll({
          where: {
            type: tWorkoutType[normalized.workoutType],
            level: tLevel[normalized.level],
            muscle_group: normalized.muscle_group,
          },
        });
      } else {
        candidateExercises = await Exercicio.findAll({
          where: {
            type: tWorkoutType[normalized.workoutType],
            level: tLevel[normalized.level],
          },
        });
      }

      if (!candidateExercises || candidateExercises.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Não foram encontrados exercícios com os parâmetros fornecidos",
        });
      }

      // ============================================
      // STEP 4) Group exercises by muscle_group
      // ============================================

      let exerciseByMuscleGroup = {};

      candidateExercises.forEach((exercise) => {
        // Ex: exercise = Bench Press; exercise.muscle_group = "Peito (Chest)"
        // Then, muscleGroup = "Peito"]
        const muscleGroup = exercise.muscle_group;

        // If this is the first time we encounter this muscle group, we initialize an empty array for it in the exerciseByMuscleGroup object
        // Ex: no "Peito" key in exerciseByMuscleGroup -> create exerciseByMuscleGroup["Pe\\\ito"] = []
        /* 
          exerciseByMuscleGroup = {
            "Peito": [],
            ...
          }
        */
        if (!exerciseByMuscleGroup[muscleGroup])
          exerciseByMuscleGroup[muscleGroup] = [];

        // Add the exercise to the corresponding muscle group array
        /* 
          exerciseByMuscleGroup = {
            "Peito": [Bench Press, ...]
          }
        */
        exerciseByMuscleGroup[muscleGroup].push(exercise);
      });

      // ============================================
      // STEP 5) Apply round-robin distribution
      // ============================================

      let selectedExercises = [];

      if (normalized.workoutType !== "cardio") {
        selectedExercises = roundRobinDistribute(
          exerciseByMuscleGroup,
          normalized.exercises_number,
        );
      } else {
        selectedExercises = candidateExercises;
      }

      if (!selectedExercises || selectedExercises.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Não foi possível selecionar exercícios para o plano de treino",
        });
      }

      // ============================================
      // STEP 6) Validate final selected exercises
      // ============================================

      let distributionByMuscleGroup = {};

      selectedExercises.forEach((ex) => {
        const muscle_group = ex.muscle_group;
        if (!distributionByMuscleGroup[muscle_group]) {
          distributionByMuscleGroup[muscle_group] = 0;
        }
        distributionByMuscleGroup[muscle_group]++;
      });

      console.log(
        "Distribuição final de exercícios por grupo muscular:",
        distributionByMuscleGroup,
      );

      // ============================================
      // STEP 7) Remove previous unsaved draft plans (optional)
      // ============================================

      /* TODO */

      // ============================================
      // STEP 8) Create workout plan record
      // ============================================

      const newPlan = await PlanoTreino.create({
        user_id: userId,

        name: `Plano ${tWorkoutType[normalized.workoutType]} - ${new Date().toLocaleDateString("pt-PT")}`,

        description: `Plano de treino do tipo ${normalized.workoutType} para nível ${normalized.level}`,

        workout_type: tWorkoutType[normalized.workoutType],

        level: tLevel[normalized.level],

        muscle_group:
          normalized.workoutType !== "cardio"
            ? normalized.muscle_group.join(", ")
            : "Vários",

        exercises_number:
          normalized.workoutType !== "cardio"
            ? normalized.exercises_number
            : selectedExercises.length,

        rest_time:
          normalized.workoutType !== "cardio" ? normalized.rest_time : 0,

        series_number:
          normalized.workoutType !== "cardio" ? normalized.series_number : 0,

        reps_number:
          normalized.workoutType !== "cardio" ? normalized.reps_number : 0,

        is_saved: false,
      });

      if (!newPlan) {
        await transaction.rollback();
        return res
          .status(500)
          .json({ message: "Erro ao criar plano de treino" });
      }

      // ============================================
      // STEP 9) Create plan-exercise associations
      // ============================================

      // This creates an association record in the ExercicioPlano table for each selected exercises, linking it to the newly created workout plan
      /* 
        exercisesForPlan = [] -> for each selected exercise, we push an object with the plan_id and exercise_id:
        
        exercisesForPlan = [
          { plan_id: newPlan.id, exercise_id: 1 },
          { plan_id: newPlan.id, exercise_id: 5 },
          ...
        ]
      */
      const exercisesForPlan = selectedExercises.map((ex) => {
        return {
          plan_id: newPlan.id,
          exercise_id: ex.id,
        };
      });

      if (exercisesForPlan.length === 0) {
        await transaction.rollback();
        return res
          .status(500)
          .json({ message: "Erro ao associar exercícios ao plano de treino" });
      }

      // We use bulkCreate to insert all associations in one query, which is more efficient than creating them one by one in a loop
      // bulkCreate: insert multiple records into a database table in a single query
      await ExerciciosPlano.bulkCreate(exercisesForPlan, { transaction });

      // ============================================
      // STEP 10) Commit transaction and return response
      // ============================================

      await transaction.commit();
      return res.status(201).json({
        message: "Plano de treino gerado com sucesso!",
        plan: newPlan,
      });
    } catch (err) {
      // ============================================
      // STEP 11) Rollback transaction on failure
      // ============================================
      console.log("Erro ao gerar plano de treino: ", err);
      await transaction?.rollback();
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async saveWorkoutPlan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const plan = await PlanoTreino.findOne({
        where: { id, user_id: userId },
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de treino não encontrado!" });

      const newSavedState = !plan.is_saved;
      await plan.update({ is_saved: newSavedState });

      const message = newSavedState
        ? "Plano de treino guardado com sucesso na tua conta!"
        : "Plano de treino removido dos teus guardados com sucesso!";

      return res.status(200).json({
        message,
        plan,
        is_saved: newSavedState,
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
        where: { id: id, user_id: userId },
      });

      if (!plan)
        return res
          .status(404)
          .json({ message: "Plano de treino não encontrado!" });

      await ExerciciosPlano.destroy({
        where: { plano_id: id },
      });

      await plan.destroy();

      return res
        .status(200)
        .json({ message: "Plano de treino eliminado com sucesso!" });
    } catch (err) {
      // console.error("Erro ao eliminar plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}

export default WorkoutPlanController;
