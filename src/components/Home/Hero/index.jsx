import { SlEnergy } from "react-icons/sl";
import { FiArrowDown, FiCheck, FiPause, FiPlay } from "react-icons/fi";
import "./index.css";

export default function Hero({ motionPaused, onToggleMotion }) {
  return (
    <section className="ff-hero" aria-labelledby="ff-hero-title">
      <div className="ff-wrap ff-hero-layout">
        <div className="ff-hero-copy">
          <p className="ff-hero-badge">
            <SlEnergy aria-hidden="true" /> A tua jornada começa aqui
          </p>
          <h1 id="ff-hero-title">
            Transforma <br className="ff-desktop-break" />
            <span>tudo em ti</span> no <br className="ff-desktop-break" />
            melhor de ti <br className="ff-desktop-break" />
            com o Fit Fetch
          </h1>
          <p className="ff-hero-description">
            Junta-te a nós e começa a tua jornada rumo a uma vida mais saudável,
            ativa e equilibrada! O Fit Fetch está aqui por ti.
          </p>
          <div className="ff-actions">
            <a className="ff-button ff-button-primary" href="#sobre">
              Sobre nós <FiArrowDown aria-hidden="true" />
            </a>
            <a className="ff-button ff-button-outline" href="#servicos">
              Explorar serviços
            </a>
          </div>
          <ul className="ff-hero-highlights" aria-label="O teu bem-estar">
            <li>
              <FiCheck aria-hidden="true" /> Treino
            </li>
            <li>
              <FiCheck aria-hidden="true" /> Nutrição
            </li>
            <li>
              <FiCheck aria-hidden="true" /> Equilíbrio
            </li>
          </ul>
        </div>
        <div className="ff-hero-art" aria-hidden="true">
          <img
            src="/img/imgs/hero-img.webp"
            alt=""
            loading="eager"
            fetchPriority="high"
            width="380"
            height="380"
          />
        </div>
      </div>
      <div className="ff-wrap ff-hero-bottom">
        <span>O teu ritmo. Os teus objetivos.</span>
        <button
          className="ff-motion-toggle"
          type="button"
          aria-pressed={motionPaused}
          onClick={onToggleMotion}
        >
          {motionPaused ? (
            <FiPlay aria-hidden="true" />
          ) : (
            <FiPause aria-hidden="true" />
          )}
          Pausar animações
        </button>
        <a href="#sobre">
          Descobre o Fit Fetch <FiArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
