import './index.css';
import Button from './../Button/index';


function Hero() {
    return (
        <section className="bg-black w-full diagonal">

            <div className="section">

                <div className="w-full lg:w-[50%] flex flex-col gap-5">
                    <h1 className="h1 font-headline">
                        Transforma <span className="text-[var(--primary)] font-bold">tudo em ti</span> no melhor de ti com a Fit Fetch
                    </h1>
                    <p className="hero-p font-body">
                        Junta-te a nós e começa a tua jornada rumo a uma vida mais saudável, ativa e equilibrada! O Fit Fetch está aqui por ti.
                    </p>

                    <div className="flex flex-row gap-5 ">
                        <Button text="Mais sobre nós" to="#"/>
                        <Button text="Como começar" to="#" isSecondary/>
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