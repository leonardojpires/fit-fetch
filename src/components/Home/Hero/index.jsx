import './index.css';
import Button from '../../Button/index';
import ParticleBackground from '../../Other/ParticleBackground/index';
import { FiUsers } from 'react-icons/fi';

function Hero() {

    return (
        <section className="relative w-full">

            <div className="diagonal absolute inset-0">
                <ParticleBackground />
            </div>
            

            <div className="section-lg flex items-center justify-between lg:gap-10 relative z-10">

                <div className="w-full flex flex-col gap-5 lg:w-[50%]">
                    <h1 className="h1 font-headline">
                        Transforma <span className="text-[var(--primary)] font-bold">tudo em ti</span> no melhor de ti com o Fit Fetch
                    </h1>
                    <p className="hero-p font-body">
                        Junta-te a nós e começa a tua jornada rumo a uma vida mais saudável, ativa e equilibrada! O Fit Fetch está aqui por ti.
                    </p>

                    <div className="flex flex-col gap-7">
                        <div className="flex flex-row gap-5 ">
                            <Button text="Mais sobre nós" to="#sobre"/>
                            <Button text="Como começar" to="#" isSecondary/>
                        </div>
                        
                        <div>
                            <div className="hero-span">
                                <FiUsers size={20} />
                                <span className="text-[0.9rem] font-body">+500 membros</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="">
                    <img src="/img/imgs/hero-img.png" alt="Fit Fetch" className="hero-img"/>
                </div>

            </div>

        </section>
    )
}

export default Hero;