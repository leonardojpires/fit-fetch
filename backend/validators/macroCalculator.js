export function calculateMacros(protein, carbs, fat) {
  const p = Number(protein) || 0;
  const c = Number(carbs) || 0;
  const f = Number(fat) || 0;

  return {
    protein: p,
    carbs: c,
    fat: f,
    calories: (p * 4) + (c * 4) + (f * 9)
  };
}

export function calculatePlanTotals(foods = []) {
  return foods.reduce((acc, food) => {
    const qty = Number(food.quantity) || 0;
    const protein = (Number(food.protein) || 0) * qty;
    const carbs = (Number(food.carbs) || 0) * qty;
    const fat = (Number(food.fat) || 0) * qty;
    const calories = (Number(food.calories) || 0) * qty;

    return {
      protein: acc.protein + protein,
      carbs: acc.carbs + carbs,
      fat: acc.fat + fat,
      calories: acc.calories + calories
    };
  }, { protein: 0, carbs: 0, fat: 0, calories: 0 });
}
