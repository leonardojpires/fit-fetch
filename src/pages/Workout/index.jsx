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
import { IoBookmarksOutline, IoBookmarksSharp  } from "react-icons/io5";
import pdfWorkoutExporter from "../../utils/pdfWorkoutExporter.js";
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

function Workout() {
  useRedirectIfNotAuth();
  const [isSaved, setIsSaved] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMuscleSelect = (muscles) => {
    console.log("Músculos selecionados:", muscles);
    setFormData((prev) => ({ ...prev, muscles: muscles }));
  };

  /*   const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      muscles: formData.workoutType === "cardio" ? [] : formData.muscles,
    };
    console.log("Payload treino: ", payload);
  }; */

  function convertToMinutes(seconds) {
    const s = Number(seconds);
    if (Number.isNaN(s)) return 0;
    return s >= 60 ? Math.floor(s / 60) : s;
  }

  async function submitAndGenerate(e) {
    e.preventDefault();
    window.scrollTo(0, 0);

    if (loading) return;
    if (!user) {
      console.error("Nenhum utilizador autenticado!");
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

      console.log("Payload enviado:", payload);
      await generatePlan(payload);
      setSuccessMessage("Plano de treino criado com sucesso!");
      setShowSuccessWarning(true);
    } catch (err) {
      console.error("Erro ao gerar plano de treino: ", err);
    }
  }

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  };

  const handleSavePlan = async (planId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      
      const response = await fetch(`http://localhost:3000/api/workout-plans/save/${planId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Erro ao guardar o plano de treino!");

      const data = await response.json();
      console.log("Plano de treino guardado com sucesso: ", data);
      setIsSaved(!isSaved);
      setSuccessMessage(isSaved ? "Plano de treino removido dos guardados!" : "Plano de treino guardado com sucesso!");
      setShowSuccessWarning(true);

    } catch(err) {
      console.error("Erro ao guardar o plano de treino: ", err);
      setError("Erro ao guardar o plano de treino!");
      setShowErrorWarning(true);
    }
  }

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
      <motion.section
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="section !mt-40 !py-10">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-black !mb-3">
            Cria o Teu Plano Personalizado
          </h1>
          <p className="font-body font-medium text-lg md:text-xl text-black/70 !mb-8">
            Escolhe o que queres treinar da forma que quiseres!
          </p>

          <div className="flex flex-col items-start lg:flex-row gap-6 !mt-4">
            <div className="lg:w-1/2 w-full bg-gray-100 !p-6 rounded-lg shadow-sm">
              <h2 className="font-headline font-bold text-2xl text-[var(--primary)] !mb-4">
                Seleciona o Tipo de Treino
              </h2>
              <p className="font-body text-gray-600 !mb-6">
                Escolhe as tuas preferências para o teu treino ideal
              </p>

              <form onSubmit={submitAndGenerate} className="font-body">
                <span className="text-lg font-medium">Tipo de treino</span>
                <div className="flex flex-col lg:flex-row gap-6 !mb-6 !mt-2">
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2">
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
                <span className="text-lg font-medium">Nível</span>
                <div className="flex flex-col lg:flex-row gap-6 !mb-6 !mt-2">
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2">
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
                    <div className="flex flex-col items-start gap-2 !mb-4">
                      <label
                        htmlFor="series_number"
                        className="text-lg font-medium"
                      >
                        Número de séries
                      </label>
                      <input
                        type="number"
                        name="series_number"
                        id="series_number"
                        placeholder="(1 a 4)"
                        min="1"
                        value={formData.series_number}
                        onChange={handleChange}
                        className="workout-input"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 !mb-4">
                      <label
                        htmlFor="reps_number"
                        className="text-lg font-medium"
                      >
                        Número de repetições
                      </label>
                      <input
                        type="number"
                        name="reps_number"
                        id="reps_number"
                        placeholder="(5 a 20)"
                        min="5"
                        value={formData.reps_number}
                        onChange={handleChange}
                        className="workout-input"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 !mb-4">
                      <label
                        htmlFor="exercises_number"
                        className="text-lg font-medium"
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
                    <div className="flex flex-col items-start gap-2 !mb-4">
                      <label
                        htmlFor="rest_time"
                        className="text-lg font-medium"
                      >
                        Descanso (segundos)
                      </label>
                      <input
                        type="number"
                        name="rest_time"
                        id="rest_time"
                        placeholder="ex: 60"
                        min="0"
                        value={formData.rest_time}
                        onChange={handleChange}
                        className="workout-input"
                      />
                    </div>
                    <BodySelector onMuscleSelect={handleMuscleSelect} />
                  </>
                )}
                {formData.workoutType === "cardio" && (
                  <div className="flex flex-col items-start gap-2 !mb-4">
                    <label
                      htmlFor="duration"
                      className="text-lg font-medium"
                    >
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      placeholder="ex: 30"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      className="workout-input"
                    />
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white !px-4 !py-2 !mt-5 cursor-pointer rounded-xl hover:bg-[var(--accent)] transition-all ease-in-out duration-200"
                  >
                    Gerar plano
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:w-1/2 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg !p-6 flex items-start justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary)]"></div>
                  <p className="font-body text-gray-600 text-center text-base md:text-lg">
                    A gerar o plano de treino...
                  </p>
                </div>
              ) : workoutPlan ? (
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
                      {workoutPlan.exercises.map((ex, index) => (
                        <tr
                          key={ex.id}
                          className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="!px-4 !py-3 text-gray-800 font-medium">
                            {ex.name}
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
                  {workoutPlan.workoutType !== "cardio" && (
                    <div className="flex flex-col gap-2">
                      <span className="font-body">
                        <strong>Descanso entre séries:</strong> {" "}
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
                      onClick={() => pdfWorkoutExporter(workoutPlan, user, convertToMinutes, tWorkoutType, tLevel)}
                      className="flex flex-center items-center gap-2 font-body text-[var(--primary)] border border-[var(--primary))] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--primary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer"
                    >
                      <IoMdDownload /> Exportar para PDF
                    </button>

                    <button
                      onClick={() => handleSavePlan(workoutPlan.id)}
                      className="flex flex-center items-center gap-2 font-body text-[var(--primary)] border border-[var(--primary))] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--primary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer"
                    >
                      { isSaved ? <IoBookmarksSharp /> : <IoBookmarksOutline /> } { isSaved ? "Plano Guardado" : "Guardar Plano" }
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-gray-400 text-center text-base md:text-lg">
                  O plano de treino vai aparecer aqui
                </p>
              )}
            </div>
          </div>
          <div className="!mt-12" />
        </div>
      </motion.section>

      {/* Warnings */}
      {validationErrors.length > 0 && (
        <ErrorWarning
          validationErrors={validationErrors}
          clearErrors={clearErrors}
        />
      )}

      {workoutPlan && showSuccessWarning && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
    </>
  );
}

export default Workout;
