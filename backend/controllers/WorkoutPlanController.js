import db from "../models/index.mjs";
import validateWorkoutPlanParams from "../validators/workoutPlanValidator.js";
import { roundRobinDistribute } from './../services/workoutDisitrubtionService';

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
      // STEP 1) Start database transaction
      // ============================================

      transaction = await db.sequelize.transaction();
      if (!transaction) return res.status(500).json({ message: "Erro ao iniciar transação" })
      
      // ============================================
      // STEP 2) Validate and normalize request payload
      // ============================================

      

      // ============================================
      // STEP 3) Fetch candidate exercises by criteria
      // ============================================

      // ============================================
      // STEP 4) Group exercises by muscle_group
      // ============================================

      // ============================================
      // STEP 5) Apply round-robin distribution
      // ============================================

      // ============================================
      // STEP 6) Validate final selected exercises
      // ============================================

      // ============================================
      // STEP 7) Remove previous unsaved draft plans (optional)
      // ============================================

      // ============================================
      // STEP 8) Create workout plan record
      // ============================================

      // ============================================
      // STEP 9) Create plan-exercise associations
      // ============================================

      // ============================================
      // STEP 10) Commit transaction and return response
      // ============================================

    } catch(err) {
      // ============================================
      // STEP 11) Rollback transaction on failure
      // ============================================
      console.log("Erro ao gerar plano de treino: ", err);
      await transaction?.rollback();
      return res.status(500).json({ message: "Erro interno do servidor" })
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
