import { Link } from "react-router-dom";
import { FiArrowRight, FiBookmark, FiSliders } from "react-icons/fi";
import { LuDumbbell, LuLeaf } from "react-icons/lu";
import { HelpBreadcrumb, HelpReveal } from "../HelpPages";
import "./index.css";

export default function PlanWorkspace({ kind, children }) {
  const nutrition = kind === "nutrition";
  const Icon = nutrition ? LuLeaf : LuDumbbell;
  return (
    <div className={`ff-help-page ff-plan-page ff-${kind}-page`}>
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpBreadcrumb
            current={nutrition ? "Plano de nutrição" : "Plano de treino"}
          />
          <HelpReveal>
            <div className="ff-plan-hero-layout">
              <div>
                <p className="ff-help-eyebrow">
                  {nutrition ? "Nutrição à tua medida" : "Treina com intenção"}
                </p>
                <h1>
                  {nutrition ? "O teu equilíbrio." : "O teu objetivo."}
                  <br />
                  <span>
                    {nutrition
                      ? "O teu plano alimentar."
                      : "O teu próximo treino."}
                  </span>
                </h1>
                <p className="ff-help-hero-description">
                  {nutrition
                    ? "Partilha os teus objetivos e preferências com o assistente. Consulta o plano, explora as refeições e guarda-o na tua conta."
                    : "Escolhe o tipo de treino, ajusta a intensidade e define o teu foco. Cria um plano para a tua próxima sessão."}
                </p>
              </div>
              <div className="ff-plan-guide">
                <span className="ff-help-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h2>
                  {nutrition
                    ? "Uma conversa para começar."
                    : "Cada detalhe conta."}
                </h2>
                <p>
                  {nutrition
                    ? "Indica o teu objetivo, os alimentos que preferes e as restrições que queres considerar."
                    : "Configura as tuas preferências e consulta o plano antes de o guardar ou exportar."}
                </p>
                <Link to="/como-funciona">
                  Como funciona <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-plan-process">
        <div className="ff-help-wrap">
          <span>
            <FiSliders aria-hidden="true" />
            {nutrition ? "Conversa e personaliza" : "Define as preferências"}
          </span>
          <span>
            <Icon aria-hidden="true" />
            Consulta o teu plano
          </span>
          <span>
            <FiBookmark aria-hidden="true" />
            Guarda para mais tarde
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
