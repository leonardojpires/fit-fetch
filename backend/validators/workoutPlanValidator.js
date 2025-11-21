const VALID_WORKOUT_TYPES = ["calisthenics", "weightlifting", "cardio"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

export default function validateWorkoutPlanParams(body) {
  const {
    duration,
    exercises_number,
    level,
    muscles,
    rest_time,
    series_number,
    workoutType,
  } = body;
  const errors = [];

  /* ERROR HANDLING */
  /* Validates the workout type */
  if (!workoutType) {
    errors.push({
      field: "workoutType",
      message: "O tipo de treino é obrigatório!",
    });
  } else if (!VALID_WORKOUT_TYPES.includes(workoutType)) {
    errors.push({ field: "workoutType", message: "Tipo de treino inválido!" });
  }

  /* Validates the level */
  if (!level) {
    errors.push({
      field: "level",
      message: "O nível de treino é obrigatório!",
    });
  } else if (!VALID_LEVELS.includes(level)) {
    errors.push({ field: "level", message: "Nível de treino inválido!" });
  }

  /* Validates the input fields */
  if (workoutType === "cardio") {
    if (duration === undefined || duration === null) {
      errors.push({
        field: "duration",
        message: "A duração de treino é obrigatória para cardio!",
      });
    } else if (Number(duration) <= 1) {
      errors.push({
        field: "duration",
        message: "Duração de treino inválida! Mínimo de 1 minuto!",
      });
    }
  } else if (VALID_WORKOUT_TYPES.includes(workoutType)) {
    if (series_number == null) {
      errors.push({
        field: "series_number",
        message: "O número de séries é obrigatório!",
      });
    } else if (Number(series_number) < 1 || Number(series_number) > 4) {
      errors.push({
        field: "series_number",
        message: "O número de séries deve ser entre 1 e 4!",
      });
    }

    if (exercises_number == null) {
      errors.push({
        field: "exercises_number",
        message: "O número de exercícios é obrigatório!",
      });
    } else if (Number(exercises_number) < 3 || Number(exercises_number) > 12) {
      errors.push({
        field: "exercises_number",
        message: "O número de exercícios deve ser entre 3 e 12!",
      });
    }

    if (rest_time == null) {
      errors.push({
        field: "rest_time",
        message: "O tempo de descanso obrigatório!",
      });
    } else if (Number(rest_time) < 0 || Number(rest_time) > 600) {
      errors.push({
        field: "rest_time",
        message: "o descanso deve estar entre 0 e 600 segundos (10 minutos)!",
      });
    }

    if (!Array.isArray(muscles) || muscles.length === 0) {
      errors.push({
        field: "muscles",
        message: "Seleciona pelo menos um grupo muscular!",
      });
    }
  }

  const normalized = {
    workoutType,
    level,
    muscles,
    exercises_number:
      exercises_number != null ? Number(exercises_number) : undefined,
    series_number: series_number != null ? Number(series_number) : undefined,
    rest_time: rest_time != null ? Number(rest_time) : undefined,
    duration: duration != null ? Number(duration) : undefined,
  };

  return { errors, normalized };
}
