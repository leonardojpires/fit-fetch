import "./index.css";
import Button from "../../Button/index";
import { SlEnergy  } from "react-icons/sl";

function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-[#0f172a] overflow-x-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f6]/20 rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f43f5e]/20 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#facc15]/10 rounded-full blur-[90px] animate-float"
          style={{ animationDelay: "4s" }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-primary/40 animate-float" />
      <div
        className="absolute top-40 right-[15%] w-3 h-3 rounded-full bg-secondary/30 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-accent/40 animate-float"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-48 right-[25%] w-2 h-2 rounded-full bg-primary/30 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="section-lg flex items-center justify-between md:gap-8 lg:gap-10 relative z-10">
        <div className="w-full flex flex-col gap-5 lg:w-[50%]">
          <div>
            <div className="hero-span">
              <SlEnergy size={20} />
              <span className="text-[0.9rem] font-body">A TUA JORNADA COMEÇA AQUI</span>
            </div>
          </div>

          <h1 className="h1 font-headline">
            Transforma{" "}
            <span className="text-[var(--primary)] font-bold">tudo em ti</span>{" "}
            no melhor de ti com o Fit Fetch
          </h1>
          <p className="hero-p font-body">
            Junta-te a nós e começa a tua jornada rumo a uma vida mais saudável,
            ativa e equilibrada! O Fit Fetch está aqui por ti.
          </p>

          <div className="flex flex-col gap-7">
            <div className="flex flex-row gap-5">
              <Button text="SOBRE NÓS" to="#sobre" />
              <Button text="SERVIÇOS" to="#servicos" isSecondary />
            </div>
          </div>
        </div>

        <div className="hero-img-div">
          <img
            src="/img/imgs/hero-img.png"
            alt="Fit Fetch - Plataforma de fitness e bem-estar"
            className="hero-img"
            loading="eager"
            width="380"
            height="380"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
