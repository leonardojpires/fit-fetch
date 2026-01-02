import Exercicio from "../models/exercicios.js";

class ExerciseController {
    static errorMessage = "Erro interno do servidor";
    static validMuscleGroups = ['peito', 'ombros', 'costas', 'pernas', 'bíceps', 'tríceps', 'abdominais', 'cardio'];
    static validTypes = ['calisthenics', 'weightlifting', 'cardio'];
    static validDifficulties = ['beginner', 'intermediate', 'advanced'];
 
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
            const { name, muscle_group, description, video_url, type, difficulty } = req.body;

            if (!name || !muscle_group) return res.status(400).json({ message: "Os campos obrigatórios devem ser preenchidos!" });
            if (!ExerciseController.validMuscleGroups.includes(muscle_group)) return res.status(400).json({ message: "Grupo muscular inválido!" });
            
            // Validar type se fornecido
            if (type && !ExerciseController.validTypes.includes(type)) {
                return res.status(400).json({ message: "Tipo de exercício inválido! Use: calisthenics, weightlifting ou cardio" });
            }
            
            // Validar difficulty se fornecido
            if (difficulty && !ExerciseController.validDifficulties.includes(difficulty)) {
                return res.status(400).json({ message: "Dificuldade inválida! Use: beginner, intermediate ou advanced" });
            }

            const exercise = await Exercicio.create({
                name,
                muscle_group,
                description: description || null,
                video_url: video_url || null,
                type: type || 'weightlifting',
                difficulty: difficulty || 'beginner'
            });

            return res.status(201).json({ exercise });
        } catch(err) {
            console.error("Erro ao adicionar exercício: ", err);
            return res.status(500).json({ message: ExerciseController.errorMessage });
        }
    }

    static async updateExercise(req, res) {
        try {
            const { id } = req.params;
            const { name, muscle_group, description, video_url, type, difficulty } = req.body;

            if (!name || !muscle_group) return res.status(400).json({ message: "Os campos obrigatórios devem ser preenchidos!" });
            if (!ExerciseController.validMuscleGroups.includes(muscle_group)) return res.status(400).json({ message: "Grupo muscular inválido!" });
            
            // Validar type se fornecido
            if (type && !ExerciseController.validTypes.includes(type)) {
                return res.status(400).json({ message: "Tipo de exercício inválido! Use: calisthenics, weightlifting ou cardio" });
            }
            
            // Validar difficulty se fornecido
            if (difficulty && !ExerciseController.validDifficulties.includes(difficulty)) {
                return res.status(400).json({ message: "Dificuldade inválida! Use: beginner, intermediate ou advanced" });
            }

            const exercise = await Exercicio.findByPk(id);
            if (!exercise) return res.status(404).json({ message: "Exercício não encontrado!" });

            await exercise.update({
                name,
                muscle_group,
                description: description || null,
                video_url: video_url || null,
                type: type || exercise.type,
                difficulty: difficulty || exercise.difficulty
            });
            return res.status(200).json(exercise);
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
