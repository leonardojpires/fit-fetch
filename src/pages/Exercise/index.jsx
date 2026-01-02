import { Link, useNavigate, useParams } from "react-router-dom";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import pdfWorkoutExporter from "./../../utils/pdfWorkoutExporter.js";
import useCurrentUser from "../../hooks/useCurrentUser";
import { IoMdDownload } from "react-icons/io";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import useRemoveWorkoutPlan from "../../hooks/WorkoutPlan/useRemoveWorkoutPlan.jsx";
import { motion } from "framer-motion";
import useGetExerciseById from "../../hooks/Exercises/useGetExercisesById.jsx";
import "./index.css";

const tType = {
  calisthenics: "Calistenia",
  weightlifting: "Musculação",
  cardio: "Cardio",
};

const tDifficulty = {
  beginner: "Iniciante",
  intermediate: "Intermédio",
  advanced: "Avançado",
};

function Exercise() {
  const { id } = useParams();
  const { loading } = useRedirectIfNotAuth();
  const { user, loading: loadingUser } = useCurrentUser();
  const { exercise, loadingExercise, error } = useGetExerciseById(id);

  const navigate = useNavigate();

  // Extrair ID do YouTube de diferentes formatos de URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading || loadingExercise) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar exercício...</p>
        </div>
      </section>
    );
  }

  if (error || !exercise) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-lg text-red-600">
              Erro ao carregar exercício
            </p>
            <p className="font-body text-sm text-gray-600">
              {error || "Exercício não encontrado"}
            </p>
            <button
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
        <div className="containers">
          <div className="exercise-header">
            <div className="exercise-title-container">
              <div className="flex flex-row items-center gap-3">
                    <Link
                        to=".."
                        onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                        }}
                        className="exercise-back-button"
                    >
                        <FaArrowLeft />
                    </Link>
                  <h1 className="font-headline font-bold text-2xl">
                    {exercise
                      ? exercise.name.slice(0, 1).toUpperCase() +
                        exercise.name.slice(1)
                      : ""}
                  </h1>
              </div>
              <p className="font-body text-black/70">Detalhes do exercício</p>
            </div>

            <div className="badge-container">
              <span className="badge-type font-body">
                {exercise.type === "weightlifting"
                  ? "Musculação"
                  : exercise.type === "calisthenics"
                  ? "Calistenia"
                  : "Cardio"}
              </span>
              <span className="badge-difficulty font-body">
                {exercise.difficulty === "beginner"
                  ? "Iniciante"
                  : exercise.difficulty === "intermediate"
                  ? "Intermédio"
                  : "Avançado"}
              </span>
              <span className="badge-muscle font-body">
                {exercise.muscle_group.slice(0, 1).toUpperCase() +
                  exercise.muscle_group.slice(1)}
              </span>
            </div>
          </div>

          {/* IMAGE/VIDEO AND INFOS */}
          <div className="flex flex-row gap-3">
            <div className="media-section">
              <img
                src={exercise.image_url || "https://placehold.co/600x400"}
                alt="Imagem do exercício"
                className="exercise-image"
              />

              {exercise.video_url && getYouTubeId(exercise.video_url) ? (
                <div
                  className="video-container"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="video-embed"
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      exercise.video_url
                    )}`}
                    title="Vídeo demonstrativo do exercício"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : exercise.video_url ? (
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-button font-body"
                >
                  <span className="text-2xl">▶️</span>
                  <span>Ver vídeo demonstrativo</span>
                </a>
              ) : (
                <div className="video-placeholder font-body">
                  <span className="text-2xl">🎥</span>
                  <span>Sem vídeo disponível</span>
                </div>
              )}
            </div>

            <div className="info-section">
              <h2 className="description-title font-heading">
                Informações
              </h2>
              <div className="info-container">
                <div className="info-item">
                  <p className="info-label font-body">
                    TIPO DE EXERCÍCIO
                  </p>
                  <span className="info-value font-body">
                    {tType[exercise.type]} (
                    {exercise.type.slice(0, 1).toUpperCase() +
                      exercise.type.slice(1)}
                    )
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">
                    DIFICULDADE
                  </p>
                  <span className="info-value font-body">
                    {tDifficulty[exercise.difficulty]} (
                    {exercise.difficulty.slice(0, 1).toUpperCase() +
                      exercise.difficulty.slice(1)}
                    )
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">
                    GRUPO MUSCULAR
                  </p>
                  <span className="info-value font-body">
                    {exercise.muscle_group.slice(0, 1).toUpperCase() +
                      exercise.muscle_group.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">
                    ADICIONADO A
                  </p>
                  <span className="info-value font-body">
                    {new Date(exercise.created_at).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="description-section">
            <h2 className="description-title font-heading">Descrição do Exercício</h2>
            <p className="description-text font-body">{exercise.description}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Exercise;
