import { FaArrowUpRightFromSquare, FaTrash } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function NutritionPlanPreview({ plan, onDeletePlan }) {
  // Calculate totals from alimentos
  const calculateTotals = (plan) => {
    let foods = [];
    if (plan?.alimentos?.length) foods = foods.concat(plan.alimentos);
    return foods.reduce(
      (totals, food) => {
        const calories = Number(food.calories) || 0;
        const protein = Number(food.protein) || 0;
        const carbs = Number(food.carbs) || 0;
        const fat = Number(food.fat) || 0;
        const quantity = Number(food.quantity || food.AlimentosPlano?.quantity) || 100;
        const serving_size = Number(food.serving_size) || 100;
        const multiplier = quantity / serving_size;

        totals.total_calories += calories * multiplier;
        totals.total_protein += protein * multiplier;
        totals.total_carbs += carbs * multiplier;
        totals.total_fat += fat * multiplier;
        return totals;
      },
      { total_calories: 0, total_protein: 0, total_carbs: 0, total_fat: 0 }
    );
  };

  const macros = calculateTotals(plan);

  return (
    <div
      key={plan.id}
      className="border rounded-lg !p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="font-headline font-bold text-lg !mb-2">
        {plan.name}
      </h3>
      <p className="font-body text-sm text-black/70 !mb-4">
        {plan.description}
      </p>
      <div className="grid grid-cols-4 gap-2 !mb-4">
        <div className="text-center bg-[var(--secondary)]/10 rounded !p-2">
          <p className="font-body text-xs text-black/70">Cal</p>
          <p className="font-headline font-bold text-sm">{Math.round(macros.total_calories)}</p>
        </div>
        <div className="text-center bg-[var(--secondary)]/10 rounded !p-2">
          <p className="font-body text-xs text-black/70">Pro</p>
          <p className="font-headline font-bold text-sm">{Math.round(macros.total_protein)}g</p>
        </div>
        <div className="text-center bg-[var(--secondary)]/10 rounded !p-2">
          <p className="font-body text-xs text-black/70">Carb</p>
          <p className="font-headline font-bold text-sm">{Math.round(macros.total_carbs)}g</p>
        </div>
        <div className="text-center bg-[var(--secondary)]/10 rounded !p-2">
          <p className="font-body text-xs text-black/70">Gord</p>
          <p className="font-headline font-bold text-sm">{Math.round(macros.total_fat)}g</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <span className="text-xs bg-[var(--secondary)]/10 text-[var(--secondary)] !px-2 !py-1 rounded">
          Plano de Alimentação
        </span>
        <div className="flex gap-2">
          <Link to={`/plano-nutricao/${plan.id}`} title="Ver Plano" className="bg-[var(--secondary)]/70 text-white rounded-sm !p-1 cursor-pointer hover:translate-y-[-2px] hover:scale-[1.02] transition-all ease-in-out duration-200"><FaArrowUpRightFromSquare /></Link>
          <button onClick={() => onDeletePlan(plan.id)} title="Apagar Plano" className="bg-red-500/70 text-white rounded-sm !p-1 cursor-pointer hover:translate-y-[-2px] hover:scale-[1.02] transition-all ease-in-out duration-200"><FaTrash /></button>
        </div>
      </div>
    </div>
  );
}

export default NutritionPlanPreview;
