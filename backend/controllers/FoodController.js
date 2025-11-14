import Alimento from "../models/alimentos.js";

class FoodController {
    static errorMessage = "Erro interno do servidor";

    static async getAllFoods(req, res) {
        try {
            const foods = await Alimento.findAll({
                order: [['name', 'ASC']]
            });
            return res.status(200).json(foods);
        } catch(err) {
            console.error("Erro ao obter alimentos: ", err);
            return res.status(500).json({ message: FoodController.errorMessage });
        }
    }

    static async getFoodById(req, res) {
        try {
            const { id } = req.params;

            const food = await Alimento.findByPk(id);
            if (!food) return res.status(404).json({ message: "Alimento não encontrado!" });
            
            return res.status(200).json(food);
        } catch(err) {
            console.error("Erro ao obter alimento por ID: ", err);
            return res.status(500).json({ message: FoodController.errorMessage });
        }
    }

    static async addFood(req, res) {
        try {
            const { name, protein, carbs, fiber } = req.body;

            if (!name) return res.status(400).json({ message: "O nome é obrigatório!" });
            if (protein === undefined || protein === null) return res.status(400).json({ message: "A proteína é obrigatória!" });
            if (carbs === undefined || carbs === null) return res.status(400).json({ message: "Os carboidratos são obrigatórios!" });
            if (fiber === undefined || fiber === null) return res.status(400).json({ message: "A fibra é obrigatória!" });
            
            if (isNaN(protein) || isNaN(carbs) || isNaN(fiber)) {
                return res.status(400).json({ message: "Proteína, carboidratos e fibra devem ser números!" });
            }

            if (protein < 0 || carbs < 0 || fiber < 0) {
                return res.status(400).json({ message: "Os valores nutricionais não podem ser negativos!" });
            }

            const newFood = await Alimento.create({
                name,
                protein: parseFloat(protein),
                carbs: parseFloat(carbs),
                fiber: parseFloat(fiber)
            });

            return res.status(201).json({ food: newFood });
        } catch(err) {
            console.error("Erro ao adicionar alimento: ", err);
            return res.status(500).json({ message: FoodController.errorMessage });
        }
    }

    static async updateFood(req, res) {
        try {
            const { id } = req.params;
            const { name, protein, carbs, fiber } = req.body;

            if (!name) return res.status(400).json({ message: "O nome é obrigatório!" });
            if (protein === undefined || protein === null) return res.status(400).json({ message: "A proteína é obrigatória!" });
            if (carbs === undefined || carbs === null) return res.status(400).json({ message: "Os carboidratos são obrigatórios!" });
            if (fiber === undefined || fiber === null) return res.status(400).json({ message: "A fibra é obrigatória!" });
            
            if (isNaN(protein) || isNaN(carbs) || isNaN(fiber)) {
                return res.status(400).json({ message: "Proteína, carboidratos e fibra devem ser números!" });
            }

            if (protein < 0 || carbs < 0 || fiber < 0) {
                return res.status(400).json({ message: "Os valores nutricionais não podem ser negativos!" });
            }

            const food = await Alimento.findByPk(id);
            if (!food) return res.status(404).json({ message: "Alimento não encontrado!" });

            await food.update({
                name,
                protein: parseFloat(protein),
                carbs: parseFloat(carbs),
                fiber: parseFloat(fiber)
            });

            return res.status(200).json({ message: "Alimento atualizado com sucesso!", food });
        } catch(err) {
            console.error("Erro ao atualizar alimento: ", err);
            return res.status(500).json({ message: FoodController.errorMessage });
        }
    }

    static async deleteFood(req, res) {
        try {
            const { id } = req.params;
            
            const food = await Alimento.findByPk(id);
            if (!food) return res.status(404).json({ message: "Alimento não encontrado!" });

            await food.destroy();
            
            return res.status(200).json({ message: "Alimento apagado com sucesso!" });
        } catch(err) {
            console.error("Erro ao apagar alimento: ", err);
            return res.status(500).json({ message: FoodController.errorMessage });
        }
    }
}

export default FoodController;
