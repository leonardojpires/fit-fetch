import { FaTrash } from "react-icons/fa6";

function PlanPreview({ plan, onDeletePlan }) {
  return (
    <div
      key={plan.id}
      className="border rounded-lg !p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="font-headline font-bold text-lg !mb-2">
        {plan.name.split(" - ")[0]}
      </h3>
      <p className="font-body text-sm text-black/70 !mb-2">
        {plan.description}
      </p>
      <div className="flex flex-col gap-1 !mb-4">
        {plan.exercicios &&
          plan.exercicios.length > 0 &&
          plan.exercicios.slice(0, 3).map((ex, index) => (
            <span
              key={index}
              className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded"
            >
              {ex.name}
            </span>
          ))}
        {plan.exercicios && plan.exercicios.length > 3 && (
          <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded">
            ...
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded">
            {plan.workout_type === "cardio"
              ? "cardio"
              : plan.workout_type === "weightlifting"
              ? "musculação"
              : plan.workout_type === "calisthenics"
              ? "calistenia"
              : plan.workout_type}
          </span>
          <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] !px-2 !py-1 rounded">
            {plan.level === "beginner" ? "iniciante" : plan.level === "intermediate" ? "intermédio" : plan.level === "advanced" ? "avançado" : plan.level}
          </span>
        </div>
        <div>
          <button onClick={() => onDeletePlan(plan.id)} className="bg-red-500/50 text-white rounded-sm !p-1 cursor-pointer hover:translate-y-[-2px] hover:scale-[1.02] transition-all ease-in-out duration-200"><FaTrash /></button>
        </div>
      </div>
    </div>
  );
}

export default PlanPreview;
