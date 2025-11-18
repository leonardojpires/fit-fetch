import './index.css';
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import BodySelector from "../../components/BodySelector";
import { useState } from 'react';

function Workout() {
  useRedirectIfNotAuth();

  const [ formData, setFormData ] = useState({
    workoutType: '',
    level: '',
    series_number: 0,
    rest_time: 0,
    exercises_number: 0,
    muscles: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })) 
  }

  const handleMuscleSelect = (muscles) => {
    console.log("Músculos selecionados:", muscles);
    setFormData(prev => ({ ...prev, muscles: muscles}));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
        ...formData,
        muscles: formData.workoutType === "cardio" ? [] : formData.muscles
    };
    console.log("Payload treino: ", payload);
  }

  return (
    <>
      <section className="w-full">
        <div className="section !mt-40 !py-10">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-black !mb-3">
            Cria o Teu Plano Personalizado
          </h1>
          <p className="font-body font-medium text-lg md:text-xl text-black/70 !mb-8">
            Escolhe o que queres treinar da forma que quiseres!
          </p>

          <div className="flex flex-col lg:flex-row gap-6 !mt-4">
            <div className="lg:w-1/2 w-full bg-gray-100 !p-6 rounded-lg shadow-sm">
              <h2 className="font-headline font-bold text-2xl text-[var(--primary)] !mb-4">
                Seleciona os Músculos
              </h2>
              <p className="font-body text-gray-600 !mb-6">
                Clica nos músculos que queres treinar:
              </p>

              <form onSubmit={handleFormSubmit} className="font-body">
                <span className="text-lg font-medium">Tipo de treino</span>
                <div className="flex flex-row gap-6 !mb-6 !mt-2">
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="workoutType" 
                            id="calisthenics"
                            value="calisthenics"
                            checked={formData.workoutType === "calisthenics"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="calisthenics" className="cursor-pointer">Calistenia</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="workoutType" 
                            id="weightlifting"
                            value="weightlifting"
                            checked={formData.workoutType === "weightlifting"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="weightlifting" className="cursor-pointer">Musculação</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="workoutType" 
                            id="cardio"
                            value="cardio"
                            checked={formData.workoutType === "cardio"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="cardio" className="cursor-pointer">Cardio</label>
                    </div>
                </div>
                <span className="text-lg font-medium">Nível</span>
                <div className="flex flex-row gap-6 !mb-6 !mt-2">
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="level" 
                            id="beginner"
                            value="beginner"
                            checked={formData.level === "beginner"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="beginner" className="cursor-pointer">Iniciante</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="level" 
                            id="intermediate"
                            value="intermediate"
                            checked={formData.level === "intermediate"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="intermediate" className="cursor-pointer">Intermédio</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="radio" 
                            name="level" 
                            id="advanced"
                            value="advanced"
                            checked={formData.level === "advanced"}
                            onChange={handleChange}
                            className="w-4 h-4 text-[var(--primary)] bg-gray-100 border-gray-300 focus:ring-[var(--primary)] focus:ring-2 cursor-pointer" 
                        />
                        <label htmlFor="advanced" className="cursor-pointer">Avançado</label>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2 !mb-4">
                    <label htmlFor="series_number" className="text-lg font-medium">Número de séries</label>
                    <input 
                        type="number" 
                        name="series_number" 
                        id="series_number" 
                        placeholder="(1 a 4)" 
                        min="1" 
                        max="4"
                        value={formData.series_number}
                        onChange={handleChange}
                        className="workout-input" 
                    />
                </div>
                <div className="flex flex-col items-start gap-2 !mb-4">
                    <label htmlFor="rest_time" className="text-lg font-medium">Descanso (segundos)</label>
                    <input 
                        type="number" 
                        name="rest_time" 
                        id="rest_time"
                        value={formData.rest_time}
                        placeholder="ex: 60"
                        onChange={handleChange} 
                        className="workout-input" 
                    />
                </div>
                <div className="flex flex-col items-start gap-2 !mb-4">
                    <label htmlFor="exercises_number" className="text-lg font-medium">Número de exercícios</label>
                    <input 
                        type="number" 
                        name="exercises_number"
                        id="exercises_number"
                        value={formData.exercises_number}
                        onChange={handleChange}
                        placeholder="(3 a 12)" 
                        className="workout-input" 
                    />
                </div>
                <BodySelector onMuscleSelect={handleMuscleSelect} isDisabled={ formData.workoutType === "cardio" } />
                <div className="flex justify-center">
                    <button type="submit" className="w-full bg-[var(--primary)] text-white !px-4 !py-2 !mt-5 cursor-pointer rounded-xl hover:bg-[var(--accent)] transition-all ease-in-out duration-200">Gerar plano</button>
                </div>
              </form>
            </div>

            <div className="lg:w-1/2 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg !p-6 flex items-center justify-center min-h-[360px]">
              <p className="font-body text-gray-400 text-center text-base md:text-lg">
                O teu plano de treino vai aparecer aqui
              </p>
            </div>
          </div>
          <div className="!mt-12" />
        </div>
      </section>
    </>
  );
}

export default Workout;
