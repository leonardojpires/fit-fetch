import validateWorkoutPlanParams from '../workoutPlanValidator.js';

describe('validateWorkoutPlanParams', () => {
  test('valida plano de cardio com duração correta', () => {
    const input = {
      workoutType: 'cardio',
      level: 'beginner',
      duration: 30,
      exercises_number: 5
    };
    
    const result = validateWorkoutPlanParams(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.normalized.workoutType).toBe('cardio');
    expect(result.normalized.duration).toBe(30);
  });

  test('rejeita plano sem tipo de treino', () => {
    const input = {
      level: 'beginner',
      exercises_number: 5
    };
    
    const result = validateWorkoutPlanParams(input);
    
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].field).toBe('Tipo de Treino');
  });

  test('valida plano de força com séries e reps', () => {
    const input = {
      workoutType: 'weightlifting',
      level: 'intermediate',
      muscles: ['peito', 'triceps'],
      series_number: 4,
      reps_number: 12,
      rest_time: 60,
      exercises_number: 6
    };
    
    const result = validateWorkoutPlanParams(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.normalized.series_number).toBe(4);
    expect(result.normalized.reps_number).toBe(12);
  });

  test('rejeita grupos musculares inválidos', () => {
    const input = {
      workoutType: 'weightlifting',
      level: 'beginner',
      muscles: ['peito', 'braços_inválidos'],
      series_number: 3,
      reps_number: 10,
      rest_time: 45,
      exercises_number: 5
    };
    
    const result = validateWorkoutPlanParams(input);
    
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].field).toBe('Grupos Musculares');
  });
});