import { Link } from "react-router-dom";
import { FiArrowLeft, FiActivity, FiCheckCircle, FiLock } from "react-icons/fi";
import "./index.css";

export default function AuthLayout({ children, recovery = false }) {
  return (
    <section className="ff-auth-page">
      <div className="ff-auth-layout">
        <aside className="ff-auth-story" aria-label="Fit Fetch">
          <Link to="/" className="ff-auth-home">
            <FiArrowLeft aria-hidden="true" /> Voltar ao início
          </Link>
          <div className="ff-auth-story-body">
            <span className="ff-auth-emblem">
              {recovery ? (
                <FiLock aria-hidden="true" />
              ) : (
                <FiActivity aria-hidden="true" />
              )}
            </span>
            <p className="ff-auth-eyebrow">TREINO · NUTRIÇÃO · BEM-ESTAR</p>
            <h2>
              {recovery ? (
                <>
                  Retoma a tua
                  <br />
                  <span>jornada.</span>
                </>
              ) : (
                <>
                  O próximo passo
                  <br />
                  começa <span>contigo.</span>
                </>
              )}
            </h2>
            <p>
              {recovery
                ? "Recupera o acesso à tua conta e volta aos teus planos de treino e alimentação."
                : "Um espaço para organizar os teus treinos, cuidar da alimentação e acompanhar os teus planos."}
            </p>
            <ul>
              <li>
                <FiCheckCircle aria-hidden="true" /> Planos de treino
                personalizados
              </li>
              <li>
                <FiCheckCircle aria-hidden="true" /> Alimentação à tua medida
              </li>
              <li>
                <FiCheckCircle aria-hidden="true" /> Tudo na tua área pessoal
              </li>
            </ul>
          </div>
          <p className="ff-auth-signature">
            <img src="/img/logos/ff_logo.svg" alt="Fit Fetch" width="154" height="52" />
            <span>O teu ritmo. Os teus objetivos.</span>
          </p>
        </aside>
        <div className="ff-auth-panel">{children}</div>
      </div>
    </section>
  );
}
