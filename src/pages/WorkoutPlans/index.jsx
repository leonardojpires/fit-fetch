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
import { motion } from "framer-motion";

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
  const { loading } = useRedirectIfNotAuth();
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

  if (loading || loadingPlan) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar planos...</p>
        </div>
      </section>
    );
  }

  if (error || !workoutPlan) {
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
            {workoutPlan ? workoutPlan.name : "Plano de Treino"}
          </h1>
          <p className="font-body text-lg md:text-xl text-black/70">
            Consulta os detalhes do teu plano de treino personalizado
          </p>
        </div>

        {/* LISTA DE PLANOS */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">
            <div className="flex flex-col gap-1 border-b-2 border-gray-200/50 !pb-4">
              <h2 className="font-headline font-bold text-2xl">Plano</h2>
              <p className="font-body text-black/70">
                Detalhes do plano de treino personalizado
              </p>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse !mb-5">
                <thead>
                  <tr className="bg-[var(--primary)] text-white">
                    <th className="!px-4 !py-3 text-left font-headline font-semibold">
                      Exercício
                    </th>
                    <th className="!px-4 !py-3 text-left font-headline font-semibold">
                      Músculo
                    </th>
                    <th className="!px-4 !py-3 text-left font-headline font-semibold">
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
                        <Link to={`/exercicio/${ex.id}`} className="flex flex-row gap-2 items-center hover:underline">
                          <FaExternalLinkAlt className="text-black/50 text-sm" aria-hidden="true" focusable="false" /> {ex.name}
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
                <div className="flex flex-col gap-2">
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

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-col items-start gap-2">
                <button
                  onClick={() =>
                    pdfWorkoutExporter(
                      workoutPlan,
                      user,
                      convertToMinutes,
                      tWorkoutType,
                      tLevel
                    )
                  }
                  className="flex flex-center items-center gap-2 font-body text-[var(--primary)] border border-[var(--primary))] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--primary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer"
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
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
    </motion.section>
  );
}

export default WorkoutPlans;
