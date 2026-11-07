import "./index.css";
import BodySelector from "../../components/BodySelector";
import { useState } from "react";
import { auth } from "../../services/firebase.js";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useGenerateWorkoutPlan from "../../hooks/WorkoutPlan/useGenerateWorkoutPlan";
import useCurrentUser from "../../hooks/useCurrentUser";
import ErrorWarning from "./../../components/ErrorWarning/index";
import SuccessWarning from "../../components/SuccessWarning";
import { IoMdDownload } from "react-icons/io";
import { IoBookmarksOutline, IoBookmarksSharp } from "react-icons/io5";
import pdfWorkoutExporter from "../../utils/pdfWorkoutExporter.js";
import PlanWorkspace from "../../components/PlanWorkspace";
import { FiClipboard, FiArrowRight } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

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

function Workout() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user, loading: userLoading } = useCurrentUser();
  const {
    workoutPlan,
    loading,
    error,
    validationErrors,
    generatePlan,
    clearErrors,
  } = useGenerateWorkoutPlan();

  const [formData, setFormData] = useState({
    workoutType: "",
    level: "",
    series_number: "",
    reps_number: "",
    rest_time: "",
    exercises_number: "",
    duration: "",
    muscles: [],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessWarning, setShowSuccessWarning] = useState(false);

  if (authLoading || userLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMuscleSelect = (muscles) => {
    // console.log("Músculos selecionados:", muscles);
    setFormData((prev) => ({ ...prev, muscles: muscles }));
  };

  /*   const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      muscles: formData.workoutType === "cardio" ? [] : formData.muscles,
    };
    // console.log("Payload treino: ", payload);
  }; */

  function convertToMinutes(seconds) {
    const s = Number(seconds);
    if (Number.isNaN(s)) return 0;
    return s >= 60 ? Math.floor(s / 60) : s;
  }

  async function submitAndGenerate(e) {
    e.preventDefault();

    const planSection = document.getElementById("plan-section");
    if (planSection) {
      const yOffset = -100;
      const y =
        planSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    if (loading) return;
    if (!user) {
      // console.error("Nenhum utilizador autenticado!");
      return;
    }

    try {
      // Build payload based on workout type to avoid sending irrelevant fields
      const basePayload = {
        workoutType: formData.workoutType,
        level: formData.level,
        user,
      };

      let payload;
      if (formData.workoutType === "cardio") {
        payload = {
          ...basePayload,
          duration:
            formData.duration !== "" ? Number(formData.duration) : undefined,
          muscles: [],
        };
      } else {
        payload = {
          ...basePayload,
          series_number:
            formData.series_number !== ""
              ? Number(formData.series_number)
              : undefined,
          exercises_number:
            formData.exercises_number !== ""
              ? Number(formData.exercises_number)
              : undefined,
          reps_number:
            formData.reps_number !== ""
              ? Number(formData.reps_number)
              : undefined,
          rest_time:
            formData.rest_time !== "" ? Number(formData.rest_time) : undefined,
          muscles: formData.muscles,
        };
      }

      // console.log("Payload enviado:", payload);
      await generatePlan(payload);
      setSuccessMessage("Plano de treino criado com sucesso!");
      setIsSaved(false);
      setShowSuccessWarning(true);
    } catch (err) {
      // console.error("Erro ao gerar plano de treino: ", err);
    }
  }

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  };

  const handleSavePlan = async (planId) => {
    setIsSaving(true);
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `http://localhost:3000/api/workout-plans/save/${planId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Erro ao guardar o plano de treino!");

      const data = await response.json();
      // console.log("Plano de treino guardado com sucesso: ", data);
      setIsSaved(!isSaved);
      setSuccessMessage(
        isSaved
          ? "Plano de treino removido dos guardados!"
          : "Plano de treino guardado com sucesso!",
      );
      setShowSuccessWarning(true);
    } catch (err) {
      // console.error("Erro ao guardar o plano de treino: ", err);
      setError("Erro ao guardar o plano de treino!");
    } finally {
      setIsSaving(false);
    }
  };

  if (validationErrors.length > 0) {
    setTimeout(() => {
      clearErrors();
    }, 3000);
  }

  if (showSuccessWarning) {
    setTimeout(() => {
      closeSuccessWarning();
    }, 3000);
  }

  return (
    <>
      <PlanWorkspace kind="workout">
        <div className="ff-help-wrap ff-plan-content">
          <div className="ff-plan-columns">
            <div className="ff-plan-settings">
              <p className="ff-plan-eyebrow">01 / As tuas preferências</p>
              <h2 className="ff-plan-card-title">Seleciona o Tipo de Treino</h2>
              <p className="ff-plan-card-description">
                Escolhe as tuas preferências para o teu treino ideal
              </p>

              <form onSubmit={submitAndGenerate} className="ff-workout-form">
                <span className="ff-workout-label">Tipo de treino</span>
                <div
                  className="ff-workout-options"
                  role="radiogroup"
                  aria-label="Tipo de treino"
                >
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="workoutType"
                      id="calisthenics"
                      value="calisthenics"
                      checked={formData.workoutType === "calisthenics"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="calisthenics" className="cursor-pointer">
                      Calistenia
                    </label>
                  </div>
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="workoutType"
                      id="weightlifting"
                      value="weightlifting"
                      checked={formData.workoutType === "weightlifting"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="weightlifting" className="cursor-pointer">
                      Musculação
                    </label>
                  </div>
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="workoutType"
                      id="cardio"
                      value="cardio"
                      checked={formData.workoutType === "cardio"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="cardio" className="cursor-pointer">
                      Cardio
                    </label>
                  </div>
                </div>
                <span className="ff-workout-label">Nível</span>
                <div
                  className="ff-workout-options"
                  role="radiogroup"
                  aria-label="Nível"
                >
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="level"
                      id="beginner"
                      value="beginner"
                      checked={formData.level === "beginner"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="beginner" className="cursor-pointer">
                      Iniciante
                    </label>
                  </div>
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="level"
                      id="intermediate"
                      value="intermediate"
                      checked={formData.level === "intermediate"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="intermediate" className="cursor-pointer">
                      Intermédio
                    </label>
                  </div>
                  <div className="ff-workout-option">
                    <input
                      type="radio"
                      name="level"
                      id="advanced"
                      value="advanced"
                      checked={formData.level === "advanced"}
                      onChange={handleChange}
                      className="workout-radio"
                    />
                    <label htmlFor="advanced" className="cursor-pointer">
                      Avançado
                    </label>
                  </div>
                </div>
                {formData.workoutType !== "cardio" && (
                  <>
                    <div className="ff-workout-field">
                      <label
                        htmlFor="series_number"
                        className="ff-workout-label"
                      >
                        Número de séries
                      </label>
                      <input
                        type="number"
                        name="series_number"
                        id="series_number"
                        placeholder="(1 a 4)"
                        aria-describedby="series-hint"
                        min="1"
                        value={formData.series_number}
                        onChange={handleChange}
                        className="workout-input"
                      />
                      <small id="series-hint" className="text-gray-600 text-sm">
                        Entre 1 e 4 séries
                      </small>
                    </div>
                    <div className="ff-workout-field">
                      <label htmlFor="reps_number" className="ff-workout-label">
                        Número de repetições
                      </label>
                      <input
                        type="number"
                        name="reps_number"
                        id="reps_number"
                        placeholder="(5 a 20)"
                        aria-describedby="reps-hint"
                        min="5"
                        value={formData.reps_number}
                        onChange={handleChange}
                        className="workout-input"
                      />
                      <small id="reps-hint" className="text-gray-600 text-sm">
                        Entre 5 e 20 repetições
                      </small>
                    </div>
                    <div className="ff-workout-field">
                      <label
                        htmlFor="exercises_number"
                        className="ff-workout-label"
                      >
                        Número de exercícios
                      </label>
                      <input
                        type="number"
                        name="exercises_number"
                        id="exercises_number"
                        placeholder="(3 a 12)"
                        min="3"
                        value={formData.exercises_number}
                        onChange={handleChange}
                        className="workout-input"
                      />
                    </div>
                    <div className="ff-workout-field">
                      <label htmlFor="rest_time" className="ff-workout-label">
                        Descanso (segundos)
                      </label>
                      <input
                        type="number"
                        name="rest_time"
                        id="rest_time"
                        placeholder="ex: 60"
                        aria-describedby="rest-hint"
                        min="0"
                        value={formData.rest_time}
                        onChange={handleChange}
                        className="workout-input"
                      />
                      <small id="rest-hint" className="text-gray-600 text-sm">
                        Em segundos
                      </small>
                    </div>
                    <div className="ff-workout-muscles">
                      <h3>Grupos musculares</h3>
                      <p>Seleciona os grupos que queres trabalhar.</p>
                      <BodySelector onMuscleSelect={handleMuscleSelect} />
                    </div>
                  </>
                )}
                {formData.workoutType === "cardio" && (
                  <div className="ff-workout-field">
                    <label htmlFor="duration" className="ff-workout-label">
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      placeholder="ex: 30"
                      aria-describedby="duration-hint"
                      min="1"
                      max="180"
                      value={formData.duration}
                      onChange={handleChange}
                      className="workout-input"
                    />
                    <small id="duration-hint" className="text-gray-600 text-sm">
                      Entre 1 e 180 minutos
                    </small>
                  </div>
                )}
                <div className="ff-workout-submit-row">
                  <button type="submit" className="ff-plan-primary-button">
                    Gerar plano
                  </button>
                </div>
              </form>
            </div>

            {/* PLAN DIV */}
            <div id="plan-section" className="ff-plan-preview">
              <div className="ff-plan-panel-heading">
                <p className="ff-plan-eyebrow">02 / O resultado</p>
                <h2>O teu plano de treino</h2>
                <p>Revê os detalhes e guarda o plano que queres seguir.</p>
              </div>
              {loading ? (
                <div className="ff-plan-loading" role="status">
                  <div className="ff-plan-spinner" aria-hidden="true"></div>
                  <p className="font-body text-gray-600 text-center text-base md:text-lg">
                    A gerar o plano de treino...
                  </p>
                </div>
              ) : workoutPlan ? (
                <div
                  className="ff-workout-result"
                  tabIndex={0}
                  role="region"
                  aria-label="Detalhes do plano de treino"
                >
                  <table className="ff-workout-table">
                    <caption>Exercícios do teu plano de treino</caption>
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
                      {workoutPlan.exercises.map((ex, index) => (
                        <tr
                          key={ex.id}
                          className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="!px-4 !py-3 text-gray-800 font-medium">
                            <Link
                              to={`/exercicio/${ex.id}`}
                              target="_blank"
                              className="flex flex-row gap-2 items-center hover:underline"
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
                            {ex.muscle}
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
                  {workoutPlan.workoutType !== "cardio" && (
                    <div className="ff-workout-summary">
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
                  <div>
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
                      className="ff-plan-action"
                    >
                      <IoMdDownload aria-hidden="true" focusable="false" />{" "}
                      Exportar para PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSavePlan(workoutPlan.id)}
                      disabled={isSaving}
                      className="ff-plan-action"
                    >
                      {isSaving ? (
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
                          A processar...
                        </>
                      ) : (
                        <>
                          {isSaved ? (
                            <IoBookmarksSharp
                              aria-hidden="true"
                              focusable="false"
                            />
                          ) : (
                            <IoBookmarksOutline
                              aria-hidden="true"
                              focusable="false"
                            />
                          )}{" "}
                          {isSaved ? "Plano Guardado" : "Guardar Plano"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ff-plan-empty">
                  <span className="ff-plan-empty-icon">
                    <FiClipboard aria-hidden="true" />
                  </span>
                  <h3>O teu plano começa aqui.</h3>
                  <p>
                    Define as preferências ao lado e seleciona “Gerar plano”. Os
                    exercícios e os detalhes da sessão aparecem aqui.
                  </p>
                  <div className="ff-plan-empty-lines" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PlanWorkspace>

      {/* Warnings */}
      {validationErrors.length > 0 && (
        <ErrorWarning
          validationErrors={validationErrors}
          clearErrors={clearErrors}
        />
      )}

      {validationErrors.length === 0 && workoutPlan && showSuccessWarning && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
    </>
  );
}

export default Workout;
