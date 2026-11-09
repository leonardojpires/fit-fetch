import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useGetWorkoutPlanById from "../../hooks/WorkoutPlan/useGetWorkoutPlanById";
import pdfWorkoutExporter from "./../../utils/pdfWorkoutExporter.js";
import useCurrentUser from "../../hooks/useCurrentUser";
import useRemoveWorkoutPlan from "../../hooks/WorkoutPlan/useRemoveWorkoutPlan.jsx";
import DeleteModal from "../../components/DeleteModal/index.jsx";
import { IoMdDownload } from "react-icons/io";
import { FaTrash, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import { HelpReveal } from "../../components/HelpPages";
import "../../components/PlanDetails/index.css";

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

function WorkoutPlans() {
  const { id } = useParams();
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { user, loading: loadingUser } = useCurrentUser();
  const { workoutPlan, loadingPlan, error } = useGetWorkoutPlanById(id);
  const removePlan = useRemoveWorkoutPlan();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  function convertToMinutes(seconds) {
    const s = Number(seconds);
    if (Number.isNaN(s)) return 0;
    return s >= 60 ? Math.floor(s / 60) : s;
  }

  function openDeleteModal() {
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
  }

  async function confirmDeletePlan() {
    setIsDeleting(true);
    try {
      const result = await removePlan(workoutPlan.id);
      if (result) {
        closeDeleteModal();
        navigate(-1);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (authLoading || loadingUser || loadingPlan) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar planos...</p>
        </div>
      </section>
    );
  }

  if (error || !workoutPlan) {
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
              className="font-body text-[var(--primary)] hover:underline"
            >
              Voltar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="ff-help-page ff-detail-page ff-detail-workout">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <nav className="ff-help-breadcrumb" aria-label="Localização">
            <ol>
              <li>
                <Link to="/perfil">O meu perfil</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span aria-current="page">Plano de treino</span>
              </li>
            </ol>
          </nav>
          <HelpReveal>
            <p className="ff-help-eyebrow">Treino · O teu plano</p>
            <h1>{workoutPlan.name}</h1>
            <p className="ff-help-hero-description">
              O teu treino, organizado. Consulta os exercícios e os detalhes
              para a tua próxima sessão.
            </p>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap ff-detail-content">
        <HelpReveal>
          {/* LISTA DE PLANOS */}
          <div className="ff-detail-card">
            <div className="ff-detail-card-inner">
              <div className="ff-detail-card-heading">
                <h2 className="font-headline font-bold text-2xl">
                  Exercícios do plano
                </h2>
                <p className="font-body text-black/70">
                  Detalhes do plano de treino personalizado
                </p>
                <p className="ff-detail-scroll-hint">
                  Desliza a tabela para consultar todos os detalhes.
                </p>
              </div>

              <div
                className="ff-detail-table-scroll"
                role="region"
                aria-label="Exercícios do plano — tabela com deslocamento horizontal"
                tabIndex={0}
              >
                <table className="ff-detail-table">
                  <caption className="ff-detail-sr-only">
                    Exercícios, grupos musculares e dificuldade
                  </caption>
                  <thead>
                    <tr className="bg-[var(--primary)] text-white">
                      <th
                        scope="col"
                        className="!px-4 !py-3 text-left font-headline font-semibold"
                      >
                        Exercício
                      </th>
                      <th
                        scope="col"
                        className="!px-4 !py-3 text-left font-headline font-semibold"
                      >
                        Músculo
                      </th>
                      <th
                        scope="col"
                        className="!px-4 !py-3 text-left font-headline font-semibold"
                      >
                        Dificuldade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-body">
                    {(workoutPlan.exercises || []).map((ex, index) => (
                      <tr
                        key={ex.id}
                        className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="!px-4 !py-3 text-gray-800 font-medium">
                          <Link
                            to={`/exercicio/${ex.id}`}
                            className="flex flex-row  items-center gap-2 hover:underline"
                          >
                            <FaExternalLinkAlt
                              className="text-black/50 text-sm"
                              aria-hidden="true"
                              focusable="false"
                            />{" "}
                            {ex.name}
                          </Link>
                        </td>
                        <td className="!px-4 !py-3 text-gray-600 capitalize">
                          {ex.muscle_group}
                        </td>
                        <td className="!px-4 !py-3">
                          <span
                            className={`inline-block !px-3 !py-1 rounded-full text-xs font-medium ${
                              ex.difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : ex.difficulty === "intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {ex.difficulty === "beginner"
                              ? "Iniciante"
                              : ex.difficulty === "intermediate"
                                ? "Intermédio"
                                : "Avançado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {workoutPlan && workoutPlan.workoutType !== "cardio" && (
                  <div className="ff-detail-prescription">
                    <span className="font-body">
                      <strong>Descanso entre séries:</strong>{" "}
                      {convertToMinutes(workoutPlan.rest_time)}{" "}
                      {workoutPlan.rest_time < 60 ? "segundos" : "minuto(s)"}
                    </span>
                    <span className="font-body">
                      <strong>Séries:</strong> {workoutPlan.series_number}
                    </span>
                    <span className="font-body">
                      <strong>Repetições:</strong> {workoutPlan.reps_number}
                    </span>
                  </div>
                )}
              </div>

              <div className="ff-detail-actions">
                <div className="ff-detail-primary-actions">
                  <button
                    type="button"
                    onClick={() =>
                      pdfWorkoutExporter(
                        workoutPlan,
                        user,
                        convertToMinutes,
                        tWorkoutType,
                        tLevel,
                      )
                    }
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

      {deleteModalOpen && workoutPlan && (
        <DeleteModal
          itemToDelete={workoutPlan}
          closeDeleteModal={closeDeleteModal}
          handleDeleteItem={confirmDeletePlan}
          title="Eliminar Plano de Treino"
          message="Tem a certeza que deseja eliminar este plano de treino?"
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default WorkoutPlans;
