import db from "../models/index.mjs";
import validateWorkoutPlanParams from "../validators/workoutPlanValidator.js";

const { PlanoTreino, Exercicio, ExerciciosPlano } = db;

class WorkoutPlanController {
  static async generateWorkoutPlan(req, res) {
    try {
      const { errors, normalized } = validateWorkoutPlanParams(req.body);
      let selectedExercises = [];

      /* Error handling */
      if (errors.length > 0) {
        return res.status(422).json({ errors });
      }

      if (normalized.workoutType !== "cardio") {
        const allExercises = await Exercicio.findAll({
          where: {
            type: normalized.workoutType,
            muscle_group: normalized.muscles,
          },
        });
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        const difficulty = difficultyOrder[normalized.level];

        const filteredExercises = allExercises.filter((ex) => {
          return difficultyOrder[ex.difficulty] === difficulty;
        });

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
      }

      const newPlan = await PlanoTreino.create({
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

      if (normalized.workoutType !== "cardio" && selectedExercises.length > 0) {
        for (const exercise of selectedExercises) {
          await ExerciciosPlano.create({
            plano_id: newPlan.id,
            exercicio_id: exercise.id,
          });
        }
      }

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
