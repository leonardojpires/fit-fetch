const VALID_WORKOUT_TYPES = ["calisthenics", "weightlifting", "cardio"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];
const VALID_MUSCLE_GROUPS = [
  "peito",
  "ombros",
  "costas",
  "pernas",
  "biceps",
  "triceps",
  "abdominais",
  "cardio",
];

export default function validateWorkoutPlanParams(body) {
  const {
    duration,
    exercises_number,
    level,
    muscles,
    rest_time,
    series_number,
    reps_number,
    workoutType,
    workout_type,
  } = body;
  const errors = [];

  // Accepts both camelCase and snake_case
  const normalizedWorkoutType = workoutType || workout_type;

  /* ERROR HANDLING */
  /* Validates the workout type */
  if (!normalizedWorkoutType) {
    errors.push({
      field: "Tipo de Treino",
      message: "O tipo de treino é obrigatório!",
    });
  } else if (!VALID_WORKOUT_TYPES.includes(normalizedWorkoutType)) {
    errors.push({
      field: "Tipo de Treino",
      message: "Tipo de treino inválido!",
    });
  }

  /* Validates the level */
  if (!level) {
    errors.push({
      field: "Nível",
      message: "O nível de treino é obrigatório!",
    });
  } else if (!VALID_LEVELS.includes(level)) {
    errors.push({ field: "level", message: "Nível de treino inválido!" });
  }

  /* Validates the input fields */
  if (normalizedWorkoutType === "cardio") {
    if (duration === undefined || duration === null) {
      errors.push({
        field: "Duração",
        message: "A duração de treino é obrigatória para cardio!",
      });
    } else if (Number.isNaN(Number(duration))) {
      errors.push({
        field: "Duração",
        message: "A duração de treino deve ser um número válido!",
      });
    } else if (Number(duration) < 1) {
      errors.push({
        field: "Duração",
        message: "A duração de treino deve ser pelo menos 1 minuto!",
      });
    }
  } else if (VALID_WORKOUT_TYPES.includes(normalizedWorkoutType)) {
    if (series_number === undefined || series_number === null) {
      errors.push({
        field: "Número de Séries",
        message: "O número de séries é obrigatório!",
      });
    } else if (Number.isNaN(Number(series_number))) {
      errors.push({
        field: "Número de Séries",
        message: "O número de séries deve ser um número válido!",
      });
    } else if (Number(series_number) < 1 || Number(series_number) > 4) {
      errors.push({
        field: "Número de Séries",
        message: "O número de séries deve ser entre 1 e 4!",
      });
    }

    if (reps_number === undefined || reps_number === null) {
      errors.push({
        field: "Número de Repetições",
        message: "O número de repetições é obrigatório!",
      });
    } else if (Number.isNaN(Number(reps_number))) {
      errors.push({
        field: "Número de Repetições",
        message: "O número de repetições deve ser um número válido!",
      });
    } else if (
      Number(reps_number) < 5 || 
      Number(reps_number) > 20
    ) {
      errors.push({
        field: "Número de Repetições",
        message: "O número de repetições deve ser entre 5 e 20!",
      });
    }

    if (exercises_number === undefined || exercises_number === null) {
      errors.push({
        field: "Número de Exercícios",
        message: "O número de exercícios é obrigatório!",
      });
    } else if (Number.isNaN(Number(exercises_number))) {
      errors.push({
        field: "Número de Exercícios",
        message: "O número de exercícios deve ser um número válido!",
      });
    } else if (
      Number(exercises_number) < 3 ||
      Number(exercises_number) > 12
    ) {
      errors.push({
        field: "Número de Exercícios",
        message: "O número de exercícios deve ser entre 3 e 12!",
      });
    }

    if (rest_time === undefined || rest_time === null) {
      errors.push({
        field: "Tempo de Descanso",
        message: "O tempo de descanso é obrigatório!",
      });
    } else if (Number.isNaN(Number(rest_time))) {
      errors.push({
        field: "Tempo de Descanso",
        message: "O tempo de descanso deve ser um número válido!",
      });
    } else if (Number(rest_time) < 0 || Number(rest_time) > 600) {
      errors.push({
        field: "rest_time",
        message: "O descanso deve estar entre 0 e 600 segundos (10 minutos)!",
      });
    }

    if (!Array.isArray(muscles) || muscles.length === 0) {
      errors.push({
        field: "Grupos Musculares",
        message: "Seleciona pelo menos um grupo muscular!",
      });
    } else {
      for (const muscle of muscles) {
        if (!VALID_MUSCLE_GROUPS.includes(muscle)) {
          errors.push({
            field: "Grupos Musculares",
            message: `Grupo muscular inválido: ${muscle}`,
          });
          break;
        }
      }
    }

    if (Array.isArray(muscles) && exercises_number) {
      if (muscles.length > Number(exercises_number)) {
        errors.push({
          field: "Grupos Musculares",
          message:
            "O número de grupos musculares não pode ser maior que o número de exercícios!",
        });
      }
    }
  }
  const normalized = {
    workoutType: normalizedWorkoutType,
    level,
    muscles: Array.isArray(muscles) ? muscles : [],
    exercises_number:
      exercises_number != null ? Number(exercises_number) : undefined,
    series_number: series_number != null ? Number(series_number) : undefined,
    reps_number: reps_number != null ? Number(reps_number) : undefined,
    rest_time: rest_time != null ? Number(rest_time) : undefined,
    duration: duration != null ? Number(duration) : undefined,
  };

  return { errors, normalized };
}
