import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import BodySelector from "../../components/BodySelector";

function Workout() {
    useRedirectIfNotAuth();

    const handleMuscleSelect = (muscles) => {
        console.log("Músculos selecionados:", muscles);
    };

    return (
        <>
            <section className="relative w-full min-h-screen overflow-x-hidden">
                <div className="section-lg ">
                    <h1 className="font-headline font-bold text-5xl text-black !mb-3">Cria o Teu Plano Personalizado</h1>
                    <p className="font-body font-mediumy text-xl text-black/70 !mb-10">Escolhe o que queres treinar da forma que quiseres! </p>
                    
                    {/* Divisória: Esquerda para escolhas, Direita para tabela do plano */}
                    <div className="flex gap-0 mt-8">
                        {/* Lado Esquerdo - Escolha do plano */}
                        <div className="w-1/2 bg-gray-100 !p-6 rounded-l-lg">
                            <h2 className="font-headline font-bold text-2xl text-[var(--primary)] !mb-4">Seleciona os Músculos</h2>
                            <p className="font-body text-gray-600 !mb-6">Clica nos músculos que queres treinar:</p>
                            
                            <BodySelector onMuscleSelect={handleMuscleSelect} />
                        </div>
                        
                        {/* Lado Direito - Vazio para tabela do plano gerado */}
                        <div className="w-1/2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-r-lg !p-8 flex items-center justify-center min-h-[400px]">
                            <p className="font-body text-gray-400 text-center text-lg">O teu plano de treino vai aparecer aqui</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Workout;
