import { Link, Navigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { HelpReveal } from "../../components/HelpPages";
import "../../components/CatalogDetails/index.css";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import "./index.css";
import useGetExerciseById from "../../hooks/Exercises/useGetExercisesById";

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
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { exercise, loadingExercise, error } = useGetExerciseById(id);

  // Extrair ID do YouTube de diferentes formatos de URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (authLoading || loadingExercise) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar exercício...</p>
        </div>
      </section>
    );
  }

  if (error || !exercise) {
    return (
      <section className="loading-section">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-lg text-red-600">
              Erro ao carregar exercício
            </p>
            <p className="font-body text-sm text-gray-600">
              {error || "Exercício não encontrado"}
            </p>
            <button
              type="button"
              onClick={() => Navigate(-1)}
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
    <div className="ff-help-page ff-catalog-page ff-exercise-page">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpReveal>
            <div className="ff-catalog-title">
              <div className="ff-catalog-title-row">
                <Link
                  to=".."
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                  className="exercise-back-button"
                >
                  <FaArrowLeft aria-hidden="true" /> Voltar
                </Link>
                <h1 className="ff-catalog-name">
                  {exercise
                    ? exercise.name.slice(0, 1).toUpperCase() +
                      exercise.name.slice(1)
                    : ""}
                </h1>
              </div>
              <p className="ff-help-hero-description">Detalhes do exercício</p>
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
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap ff-catalog-content">
        <HelpReveal>
          {/* IMAGE/VIDEO AND INFOS */}
          <div className="ff-catalog-grid">
            <section
              className="media-section"
              aria-labelledby="exercise-media-title"
            >
              <h2 id="exercise-media-title">Demonstração</h2>
              {exercise.video_url && getYouTubeId(exercise.video_url) ? (
                <div className="video-container">
                  <iframe
                    className="video-embed"
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      exercise.video_url,
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
                  <span className="text-2xl" aria-hidden="true">
                    ▶️
                  </span>
                  <span>
                    Ver vídeo demonstrativo{" "}
                    <small>(abre numa nova janela)</small>
                  </span>
                </a>
              ) : (
                <div className="video-placeholder font-body">
                  <span className="text-2xl" aria-hidden="true">
                    🎥
                  </span>
                  <span>Sem vídeo disponível</span>
                </div>
              )}
            </section>

            <div className="info-section">
              <h2 className="description-title font-heading">Informações</h2>
              <div className="info-container">
                <div className="info-item">
                  <p className="info-label font-body">TIPO DE EXERCÍCIO</p>
                  <span className="info-value font-body">
                    {tType[exercise.type]} (
                    {exercise.type.slice(0, 1).toUpperCase() +
                      exercise.type.slice(1)}
                    )
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">DIFICULDADE</p>
                  <span className="info-value font-body">
                    {tDifficulty[exercise.difficulty]} (
                    {exercise.difficulty.slice(0, 1).toUpperCase() +
                      exercise.difficulty.slice(1)}
                    )
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">GRUPO MUSCULAR</p>
                  <span className="info-value font-body">
                    {exercise.muscle_group.slice(0, 1).toUpperCase() +
                      exercise.muscle_group.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">ADICIONADO A</p>
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
            <h2 className="description-title font-heading">
              Descrição do Exercício
            </h2>
            <p className="description-text font-body">{exercise.description}</p>
          </div>
        </HelpReveal>
      </div>
    </div>
  );
}

export default Exercise;
