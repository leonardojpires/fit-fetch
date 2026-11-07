import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./index.css";

export default function CTA() {
  return (
    <section className="ff-cta-section" aria-labelledby="ff-cta-title">
      <div className="ff-wrap">
        <div className="ff-cta">
          <div className="ff-cta-copy">
            <p className="ff-eyebrow">O próximo passo é teu</p>
            <h2 id="ff-cta-title">
              Faz de ti o teu
              <br />
              melhor projeto.
            </h2>
            <p>
              Orgulha-te de cada conquista, por mais pequena que seja. A tua
              nova rotina começa aqui.
            </p>
          </div>
          <div className="ff-cta-actions">
            <Link to="/entrar" className="ff-button ff-button-white">
              Inscreve-te agora <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/contacto" className="ff-cta-contact">
              Tens dúvidas? Fala connosco
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
