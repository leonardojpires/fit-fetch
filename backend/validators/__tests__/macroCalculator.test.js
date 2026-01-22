import { calculateMacros, calculatePlanTotals } from '../macroCalculator.js';

describe('calculateMacros', () => {
  test('calcula calorias corretas para macros dados', () => {
    const result = calculateMacros(30, 50, 20);
    
    expect(result.protein).toBe(30);
    expect(result.carbs).toBe(50);
    expect(result.fat).toBe(20);
    expect(result.calories).toBe(500); // 30*4 + 50*4 + 20*9
  });

  test('calcula zero calorias para macros zero', () => {
    const result = calculateMacros(0, 0, 0);
    
    expect(result.calories).toBe(0);
  });
});

describe('calculatePlanTotals', () => {
  test('soma macros de múltiplos alimentos', () => {
    const foods = [
      { protein: 10, carbs: 20, fat: 5, calories: 165, quantity: 2 },
      { protein: 15, carbs: 10, fat: 8, calories: 172, quantity: 1 }
    ];
    
    const result = calculatePlanTotals(foods);
    
    expect(result.protein).toBe(35); // (10*2) + (15*1)
    expect(result.carbs).toBe(50);   // (20*2) + (10*1)
    expect(result.fat).toBe(18);     // (5*2) + (8*1)
    expect(result.calories).toBe(502); // (165*2) + (172*1)
  });

  test('retorna zeros para array vazio', () => {
    const result = calculatePlanTotals([]);
    
    expect(result.protein).toBe(0);
    expect(result.calories).toBe(0);
  });
});