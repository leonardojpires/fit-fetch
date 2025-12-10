import { useParams } from "react-router-dom";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useGetWorkoutPlanById from "../../hooks/WorkoutPlan/useGetWorkoutPlanById";

function WorkoutPlans() {
  const { id } = useParams();
  const { loading } = useRedirectIfNotAuth();

  const { workoutPlan, loadingPlan, error } = useGetWorkoutPlanById(id);

  function convertToMinutes(seconds) {
    const s = Number(seconds);
    if (Number.isNaN(s)) return 0;
    return s >= 60 ? Math.floor(s / 60) : s;
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

  return (
    <section className="w-full">
      <div className="section !mt-40 !mb-40 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-black">
            {workoutPlan ? workoutPlan.name : "Plano de Treino"}
          </h1>
          <p className="font-body text-lg md:text-xl text-black/70">
            Consulta, guarda e organiza os teus planos personalizados.
          </p>
        </div>

        {/* FILTROS */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">
            <div className="flex flex-col gap-1 border-b-2 border-gray-200/50 !pb-4">
              <h2 className="font-headline font-bold text-2xl">Filtros</h2>
              <p className="font-body text-black/70">
                Seleciona filtros para encontrar rapidamente os teus planos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50" />
              <div className="h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50" />
              <div className="h-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50" />
            </div>
          </div>
        </div>

        {/* LISTA DE PLANOS */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">
            <div className="flex flex-col gap-1 border-b-2 border-gray-200/50 !pb-4">
              <h2 className="font-headline font-bold text-2xl">Plano</h2>
              <p className="font-body text-black/70">
                Os teus planos gerados aparecem aqui. Seleciona um para ver
                detalhes.
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
                  {workoutPlan.exercicios.map((ex, index) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkoutPlans;
