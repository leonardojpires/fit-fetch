function PlanPreview({ plan }) {
  return (
    <div
      key={plan.id}
      className="border rounded-lg !p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="font-headline font-bold text-lg !mb-2">{plan.name.split(" - ")[0]}</h3>
      <p className="font-body text-sm text-black/70 !mb-2">
        {plan.description}
      </p>
      <div className="flex flex-col gap-1 !mb-4">
        { plan.exercicios && plan.exercicios.length > 0 && (
            plan.exercicios.slice(0, 3).map((ex, index) => (
                <span key={index} className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded">{ex.name}</span>
            ))
        )}
        { plan.exercicios && plan.exercicios.length > 3 && (
            <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded">...</span>
        ) }
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] !px-2 !py-1 rounded">
          {plan.workout_type}
        </span>
        <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] !px-2 !py-1 rounded">
          {plan.level}
        </span>
      </div>
    </div>
  );
}

export default PlanPreview;
