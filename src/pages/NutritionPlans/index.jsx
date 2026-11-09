import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useGetNutritionPlanById from "../../hooks/Nutrition/useGetNutritionPlanById";
import useCurrentUser from "../../hooks/useCurrentUser";
import useRemoveNutritionPlan from "../../hooks/Nutrition/useRemoveNutritionPlan";
import DeleteModal from "../../components/DeleteModal/index.jsx";
import pdfNutritionExporter from "../../utils/pdfNutritionExporter";
import { IoMdDownload } from "react-icons/io";
import { FaTrash, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { HelpReveal } from "../../components/HelpPages";
import "../../components/PlanDetails/index.css";

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
  // console.log("Nutrition Plan Data:", nutritionPlan);
  // console.log("Total Calories:", nutritionPlan?.total_calories);
  // console.log("Alimentos:", nutritionPlan?.alimentos);

  // Calculate totals from foods if they're missing
  const calculateTotals = () => {
    if (!nutritionPlan?.alimentos || nutritionPlan.alimentos.length === 0) {
      return {
        total_calories: nutritionPlan?.total_calories || 0,
        total_proteins: nutritionPlan?.total_proteins || 0,
        total_carbs: nutritionPlan?.total_carbs || 0,
        total_fats: nutritionPlan?.total_fats || 0,
      };
    }

    let totals = {
      total_calories: 0,
      total_proteins: 0,
      total_carbs: 0,
      total_fats: 0,
    };

    nutritionPlan.alimentos.forEach((food) => {
      const quantity = food.AlimentosPlano?.quantity || 100;
      const multiplier = quantity / (food.serving_size || 100);

      totals.total_calories += (food.calories || 0) * multiplier;
      totals.total_proteins += (food.protein || 0) * multiplier;
      totals.total_carbs += (food.carbs || 0) * multiplier;
      totals.total_fats += (food.fat || 0) * multiplier;
    });

    return totals;
  };

  const macros = calculateTotals();

  if (authLoading || loadingUser || loadingPlan) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar plano...</p>
        </div>
      </section>
    );
  }

  if (error || !nutritionPlan) {
    return (
      <section className="loading-section">
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
    <div className="ff-help-page ff-detail-page ff-detail-nutrition">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <nav className="ff-help-breadcrumb" aria-label="Localização">
            <ol>
              <li>
                <Link to="/perfil">O meu perfil</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Plano alimentar</span>
              </li>
            </ol>
          </nav>
          <HelpReveal>
            <p className="ff-help-eyebrow">Nutrição · O teu plano</p>
            <h1>{nutritionPlan.name}</h1>
            <p className="ff-help-hero-description">
              A tua alimentação, organizada. Consulta os alimentos, as
              quantidades e o resumo nutricional do teu plano.
            </p>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap ff-detail-content">
        <HelpReveal>
          {/* MACROS OVERVIEW */}
          <div
            className="ff-detail-macros"
            aria-label="Resumo nutricional do plano"
          >
            <div className="ff-detail-macro">
              <p className="font-body text-sm text-black/70 mb-2">Calorias</p>
              <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
                {Math.round(macros.total_calories)}
                <small> kcal</small>
              </p>
            </div>
            <div className="ff-detail-macro">
              <p className="font-body text-sm text-black/70 mb-2">Proteína</p>
              <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
                {Math.round(macros.total_proteins)}g
              </p>
            </div>
            <div className="ff-detail-macro">
              <p className="font-body text-sm text-black/70 mb-2">
                Hidratos de carbono
              </p>
              <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
                {Math.round(macros.total_carbs)}g
              </p>
            </div>
            <div className="ff-detail-macro">
              <p className="font-body text-sm text-black/70 mb-2">Gordura</p>
              <p className="font-headline font-bold text-3xl text-[var(--secondary)]">
                {Math.round(macros.total_fats)}g
              </p>
            </div>
          </div>

          {/* MEALS LIST */}
          <div className="ff-detail-card">
            <div className="ff-detail-card-inner">
              <div className="ff-detail-card-heading">
                <h2 className="font-headline font-bold text-2xl">
                  Alimentos do plano
                </h2>
                <p className="font-body text-black/70">
                  {nutritionPlan.description || "Plano alimentar personalizado"}
                </p>
                <p className="ff-detail-scroll-hint">
                  Desliza a tabela para consultar todos os detalhes.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {nutritionPlan.alimentos &&
                nutritionPlan.alimentos.length > 0 ? (
                  <div
                    className="ff-detail-table-scroll"
                    role="region"
                    aria-label="Alimentos e valores nutricionais — tabela com deslocamento horizontal"
                    tabIndex={0}
                  >
                    <table className="ff-detail-table">
                      <caption className="ff-detail-sr-only">
                        Quantidades e valores nutricionais de cada alimento do
                        plano
                      </caption>
                      <thead>
                        <tr className="bg-[var(--secondary)] text-white">
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
                            Alimento
                          </th>
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
                            Quantidade
                          </th>
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
                            Calorias
                          </th>
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
                            Proteína
                          </th>
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
                            Hidratos
                          </th>
                          <th
                            scope="col"
                            className="!px-4 !py-3 text-left font-headline font-semibold"
                          >
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
                  <p className="ff-detail-empty">
                    Nenhum alimento encontrado neste plano.
                  </p>
                )}
              </div>

              <div className="ff-detail-actions">
                <div className="ff-detail-primary-actions">
                  <button
                    type="button"
                    onClick={() => pdfNutritionExporter(nutritionPlan, user)}
                    className="ff-detail-button ff-detail-export"
                  >
                    <IoMdDownload aria-hidden="true" /> Exportar para PDF
                  </button>

                  <button
                    type="button"
                    onClick={openDeleteModal}
                    disabled={isDeleting}
                    className="ff-detail-button ff-detail-delete"
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
                        <FaTrash aria-hidden="true" focusable="false" />{" "}
                        Eliminar
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="ff-detail-button ff-detail-back"
                >
                  <FaArrowLeft aria-hidden="true" focusable="false" /> Voltar
                </button>
              </div>
            </div>
          </div>
        </HelpReveal>
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
    </div>
  );
}

export default NutritionPlans;
