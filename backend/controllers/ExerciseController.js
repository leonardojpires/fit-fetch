import Exercicio from "../models/exercicios.js";

class ExerciseController {
    static errorMessage = "Erro interno do servidor";
    static validMuscleGroups = ['peito', 'ombros', 'costas', 'pernas', 'bíceps', 'tríceps', 'abdominais', 'cardio'];

    static async getAllExercises(req, res) {
        try {
            const exercises = await Exercicio.findAll();
            return res.status(200).json((exercises));
        } catch(err) {
            console.error("Erro ao obter exercícios: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    }

    static async getExerciseById(req, res) {
        try {
            const { id } = req.params;

            const exercise = await Exercicio.findByPk(id);
            if (!exercise) return res.status(404).json({ message: "Exercício não encontrado!" });
            return res.status(200).json(exercise)
        } catch(err) {
            console.error("Erro ao obter exercício por ID: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    } 

    static async addExercise(req, res) {
        try {
            const { name, muscle_group, description, image_url, video_url, series, rest_time } = req.body;

            if (!name || !muscle_group || !series || !rest_time) return res.status(400).json({ message: "Os campos obrigatórios devem ser preenchidos!" });
            if (isNaN(series) || isNaN(rest_time)) return res.status(400).json({ message: "As séries e o tempo de descanso devem ser números!" });
            if (!ExerciseController.validMuscleGroups.includes(muscle_group)) return res.status(400).json({ message: "Grupo muscular inválido!" });

            const newExercise = await Exercicio.create({
                name,
                muscle_group,
                description: description || null,
                image_url: image_url || null,
                video_url: video_url || null,
                series,
                rest_time
            });

            return res.status(201).json({ exercise: newExercise });
        } catch(err) {
            console.error("Erro ao adicionar exercício: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    }

    static async updateExercise(req, res) {
        try {
            const { id } = req.params;
            const { name, muscle_group, description, image_url, video_url, series, rest_time } = req.body;

            if (!name || !muscle_group || !series || !rest_time) return res.status(400).json({ message: "Os campos obrigatórios devem ser preenchidos!" });
            if (isNaN(series) || isNaN(rest_time)) return res.status(400).json({ message: "As séries e o tempo de descanso devem ser números!" });
            if (!ExerciseController.validMuscleGroups.includes(muscle_group)) return res.status(400).json({ message: "Grupo muscular inválido!" });

            const exercise = await Exercicio.findByPk(id);
            if (!exercise) return res.status(404).json({ message: "Exercício não encontrado!" });

            await exercise.update({
                name,
                muscle_group,
                description: description || null,
                image_url: image_url || null,
                video_url: video_url || null,
                series,
                rest_time
            });
            return res.status(200).json({ message: "Excercício atualizado com sucesso!", exercise });
        } catch(err) {
            console.error("Erro ao atualizar exercício: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    }

    static async deleteExercise(req, res) {
        try {
            const { id } = req.params;
            const exercise = await Exercicio.findByPk(id);
            if (!exercise) return res.status(404).json({ message: "Exercício não encontrado!" });

            await exercise.destroy();
            return res.status(200).json({ message: "Exercício apagado com sucesso!" });
        } catch(err) {
            console.error("Erro ao apagar exercício: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    }

}

export default ExerciseController;
