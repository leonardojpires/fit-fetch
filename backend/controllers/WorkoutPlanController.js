import db from "../models/index.mjs";
import validateWorkoutPlanParams from "../validators/workoutPlanValidator.js";

const { PlanoTreino, Exercicio, ExerciciosPlano } = db;

class WorkoutPlanController {
  static async getAllWorkoutPlans(req, res) {
    try {
      const plans = await PlanoTreino.findAll();
      return res.status(200).json(plans);
    } catch (err) {
      console.error("Erro ao obter planos de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getWorkoutPlanById(req, res) {
    try {
      const { id } = req.params;

      // It fetches the workout plan by its ID, including the associated exercises through many-to-many relationship
      // The 'include' is the JOIN operation to get related exercises
      // The 'through' options specifies that we don't want any attributes rom the JOIN table
      const plan = await PlanoTreino.findByPk(id, {
        include: [
          {
            model: Exercicio,
            as: "exercicios",
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
      console.error("Erro ao obter plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async getUserWorkoutPlans(req, res) {
    try {
      const userId = req.user.id;

      const plans = await PlanoTreino.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Exercicio,
            as: "exercicios",
            through: { attributes: [] },
          },
        ],
      });

      return res.status(200).json({ plans });
    } catch (err) {
      console.error("Erro ao obter planos de treino do utilizador: ", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  static async generateWorkoutPlan(req, res) {
    try {
      const { errors, normalized } = validateWorkoutPlanParams(req.body);
      let selectedExercises = [];

      /* Error handling */
      if (errors.length > 0) {
        return res.status(422).json({ errors });
      }

      // Here, if the workout type is not cardio, the controller will select exercises that match the criteria (type: weightlifting or calisthetnics and muscle groups)
      if (normalized.workoutType !== "cardio") {
        const allExercises = await Exercicio.findAll({
          where: {
            type: normalized.workoutType,
            muscle_group: normalized.muscles,
          },
        });

        // It converts the difficulty level into numeric values for easier comparison, where beginner = 1, intermediate = 2, advanced = 3
        // The difficulty is then assigned as a numeric value
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        const difficulty = difficultyOrder[normalized.level];

        // Then, it filters all the exercises (previosly fetched from the database) to only include those who match the difficulty level
        const filteredExercises = allExercises.filter((ex) => {
          return difficultyOrder[ex.difficulty] === difficulty;
        });

        // Suffles the filtered exercises to ensure randomness in selection
        const shuffled = filteredExercises.sort(() => Math.random() - 0.5);

        // It tries to cover all the muscle groups specified by the user by iterating through each muscle group and selecting the first exercise that matches and hasn't been selected yet
        // For example: if the user selected "peito" (chest) and "costas" (back), it looks for an exercise that targets "peito" and adds it to the selected list, then looks for an exercise that targets "costas" and adds it to the list as well
        const covered = [];
        for (const muscle of normalized.muscles) {
          const exercise = shuffled.find(
            (e) => e.muscle_group === muscle && !covered.includes(e)
          );
          if (exercise) covered.push(exercise);
        }

        // Finally, it fills the remaining slots with random exercises from the shuffled list until reaching the specified number of exercises
        for (const ex of shuffled) {
          if (covered.length >= normalized.exercises_number) break;
          if (!covered.includes(ex)) covered.push(ex);
        }

        selectedExercises = covered;
      }

      if (
        selectedExercises.length === 0 &&
        normalized.workoutType !== "cardio"
      ) {
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

      // It creates the workout plan in the PlanoTreino table
      const newPlan = await PlanoTreino.create({
        user_id: req.user?.id || null, // Get user ID from authenticated request, or null if not authenticated
        name: `Plano ${normalized.workoutType} - ${new Date()}`,
        description: `Plano de treino do tipo ${normalized.workoutType} para nível ${normalized.level}`,
        workout_type: normalized.workoutType,
        level: normalized.level,
        exercises_number:
          normalized.workoutType === "cardio" ? 0 : selectedExercises.length,
        duration: normalized.duration || null,
        muscles: normalized.muscles,
        rest_time: normalized.rest_time || null,
        series_number: normalized.series_number || null,
      });

      // If the workout type is not cardio, it relates the selected excercises to the created plan in the pivot table
      if (normalized.workoutType !== "cardio" && selectedExercises.length > 0) {
        for (const exercise of selectedExercises) {
          await ExerciciosPlano.create({
            plano_id: newPlan.id,
            exercicio_id: exercise.id,
          });
        }
      }

      // Lastly, it returns the created plan along with a success message
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
          exercises: selectedExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            muscle_group: ex.muscle_group,
            difficulty: ex.difficulty,
          })),
        },
      });
    } catch (err) {
      console.error("Erro ao gerar plano de treino: ", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}

export default WorkoutPlanController;
