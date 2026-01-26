import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useGetNutritionPlanById from "../../hooks/Nutrition/useGetNutritionPlanById";
import useCurrentUser from "../../hooks/useCurrentUser";
import useRemoveNutritionPlan from "../../hooks/Nutrition/useRemoveNutritionPlan";
import DeleteModal from "../../components/DeleteModal/index.jsx";
import { IoMdDownload } from "react-icons/io";
import { FaTrash, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function NutritionPlans() {
  const { id } = useParams();
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { user, loading: loadingUser } = useCurrentUser();
  const { nutritionPlan, loadingPlan, error } = useGetNutritionPlanById(id);
  const removePlan = useRemoveNutritionPlan();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  function openDeleteModal() {
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
  }

  async function confirmDeletePlan() {
    setIsDeleting(true);
    try {
      const result = await removePlan(nutritionPlan.id);
      if (result) {
        closeDeleteModal();
        navigate(-1);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  // Debug: log the nutrition plan data
  console.log("Nutrition Plan Data:", nutritionPlan);
  console.log("Total Calories:", nutritionPlan?.total_calories);
  console.log("Alimentos:", nutritionPlan?.alimentos);

  // Calculate totals from foods if they're missing
const calculateTotals = (plan) => {
  let foods = [];

  if (plan?.meals?.length) {
    plan.meals.forEach(meal => {
      if (Array.isArray(meal.foods)) foods = foods.concat(meal.foods);
    });
  }

  if (plan?.alimentos?.length) foods = foods.concat(plan.alimentos);

  return foods.reduce(
    (totals, food) => {
      const calories = Number(food.calories) || 0;
      const protein = Number(food.protein) || 0;
      const carbs = Number(food.carbs) || 0;
      const fat = Number(food.fat) || 0;
      const quantity = Number(food.quantity || food.AlimentosPlano?.quantity) || 100;
      const serving_size = Number(food.serving_size) || 100;
      const multiplier = quantity / serving_size;

      totals.total_calories += calories * multiplier;
      totals.total_protein += protein * multiplier;
      totals.total_carbs += carbs * multiplier;
      totals.total_fat += fat * multiplier;

      return totals;
    },
    { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 }
  )
};

  const macros = calculateTotals(nutritionPlan);

  if (authLoading || loadingUser || loadingPlan) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar plano...</p>
        </div>
      </section>
    );
  }

  if (error || !nutritionPlan) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-lg text-red-600">
              Erro ao carregar plano
            </p>
            <p className="font-body text-sm text-gray-600">
              {error || "Plano não encontrado"}
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="font-body text-[var(--secondary)] hover:underline"
            >
              Voltar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="section !mt-40 !mb-40 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-black">
            {nutritionPlan.name}
          </h1>
          <p className="font-body text-lg md:text-xl text-black/70">
            Consulta os detalhes do teu plano de nutrição personalizado
          </p>
        </div>

        {/* MACROS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="containers !p-6 text-center">
            <p className="font-body text-sm text-black/70 mb-2">Calorias</p>
            <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
              {Math.round(macros.total_calories)}
            </p>
          </div>
          <div className="containers !p-6 text-center">
            <p className="font-body text-sm text-black/70 mb-2">Proteína</p>
            <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
              {Math.round(macros.total_protein)}g
            </p>
          </div>
          <div className="containers !p-6 text-center">
            <p className="font-body text-sm text-black/70 mb-2">Carboidratos</p>
            <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
              {Math.round(macros.total_carbs)}g
            </p>
          </div>
          <div className="containers !p-6 text-center">
            <p className="font-body text-sm text-black/70 mb-2">Gordura</p>
            <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
              {Math.round(macros.total_fat)}g
            </p>
          </div>
        </div>

        {/* MEALS LIST */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">
            <div className="flex flex-col gap-1 border-b-2 border-gray-200/50 !pb-4">
              <h2 className="font-headline font-bold text-2xl">Refeições</h2>
              <p className="font-body text-black/70">
                {nutritionPlan.description || "Plano alimentar personalizado"}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {nutritionPlan.alimentos && nutritionPlan.alimentos.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[var(--secondary)] text-white">
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Alimento
                        </th>
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Quantidade
                        </th>
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Calorias
                        </th>
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Proteína
                        </th>
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Carbos
                        </th>
                        <th className="!px-4 !py-3 text-left font-headline font-semibold">
                          Gordura
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-body">
                      {nutritionPlan.alimentos.map((food, index) => {
                        const quantity = food.AlimentosPlano?.quantity || 100;
                        const multiplier = quantity / food.serving_size;

                        return (
                          <tr
                            key={food.id}
                            className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="!px-4 !py-3 text-gray-800 font-medium">
                              <Link
                                to={`/alimento/${food.id}`}
                                className="flex flex-row items-center gap-2 hover:underline"
                              >
                                <FaExternalLinkAlt
                                  className="text-black/50 text-sm"
                                  aria-hidden="true"
                                  focusable="false"
                                />
                                {food.name}
                              </Link>
                            </td>
                            <td className="!px-4 !py-3 text-gray-600">
                              {quantity}g
                            </td>
                            <td className="!px-4 !py-3 text-gray-600">
                              {Math.round(food.calories * multiplier)}
                            </td>
                            <td className="!px-4 !py-3 text-gray-600">
                              {Math.round(food.protein * multiplier)}g
                            </td>
                            <td className="!px-4 !py-3 text-gray-600">
                              {Math.round(food.carbs * multiplier)}g
                            </td>
                            <td className="!px-4 !py-3 text-gray-600">
                              {Math.round(food.fat * multiplier)}g
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="font-body text-black/50">
                  Nenhum alimento encontrado neste plano.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col items-start gap-2">
                <button
                  onClick={() =>
                    alert("Exportação para PDF em desenvolvimento")
                  }
                  className="flex flex-center items-center gap-2 font-body text-[var(--secondary)] border border-[var(--secondary)] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--secondary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer"
                >
                  <IoMdDownload /> Exportar para PDF
                </button>

                <button
                  onClick={openDeleteModal}
                  disabled={isDeleting}
                  className="flex flex-center items-center gap-2 font-body text-red-600 border border-red-600 rounded-lg !px-4 !py-2 hover:text-white hover:bg-red-600 transition-all ease-in-out duration-200 !mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      A eliminar...
                    </>
                  ) : (
                    <>
                      <FaTrash aria-hidden="true" focusable="false" /> Eliminar
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 font-body text-[var(--secondary)] hover:underline cursor-pointer"
              >
                <FaArrowLeft aria-hidden="true" focusable="false" /> Voltar
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteModalOpen && nutritionPlan && (
        <DeleteModal
          itemToDelete={nutritionPlan}
          closeDeleteModal={closeDeleteModal}
          handleDeleteItem={confirmDeletePlan}
          title="Eliminar Plano de Alimentação"
          message="Tem a certeza que deseja eliminar este plano de alimentação?"
          isDeleting={isDeleting}
        />
      )}
    </motion.section>
  );
}

export default NutritionPlans;
