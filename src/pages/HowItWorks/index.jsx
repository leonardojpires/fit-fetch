import "./index.css";
import { Link } from "react-router-dom";
import {
  HelpReveal,
  HelpBreadcrumb,
  HelpContact,
} from "../../components/HelpPages";
import { LuDumbbell, LuLeaf } from "react-icons/lu";
import {
  FiSettings,
  FiFilter,
  FiTrendingUp,
  FiBookmark,
  FiClock,
  FiDownload,
  FiShield,
  FiArrowRight,
  FiDatabase,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

const trainingSteps = [
  {
    title: "Define o foco",
    description:
      "Escolhe o tipo de treino (calistenia, musculação ou cardio) e qual é o teu nível. Para força adicionas séries, repetições, número de exercícios, tempo de descanso e grupos musculares; para cardio basta escolheres quanto tempo tens.",
    icon: FiSettings,
  },
  {
    title: "Verificação dos dados",
    description:
      "O sistema verifica se tudo está correto. Garante um número de exercícios entre 3 e 12, séries entre 1 e 4, repetições entre 5 e 20. Se algo não estiver bem, avisa-te imediatamente.",
    icon: FiShield,
  },
  {
    title: "Seleção dos exercícios",
    description:
      "O sistema procura exercícios que combinam com o que escolheste: tipo, dificuldade e grupos musculares. Mistura tudo para criar variedade mantendo os teus critérios.",
    icon: FiFilter,
  },
  {
    title: "Plano pronto a usar",
    description:
      "Recebes o plano com séries, repetições, descanso ou duração já calculados. Se tinhas um plano anterior não guardado, é removido para evitar confusão.",
    icon: FiTrendingUp,
  },
  {
    title: "Guardar e partilhar",
    description:
      "Guarda o plano para recuperar sempre que quiseres. Exporta em PDF para levar para a ginásio ou partilhar com amigos.",
    icon: FiBookmark,
  },
];

const nutritionSteps = [
  {
    title: "Abre a Nutrição",
    description: "Acede à página de Nutrição (precisas de estar autenticado).",
    icon: FiMessageSquare,
  },
  {
    title: "Conversa com o assistente",
    description:
      "Escreve objetivos, preferências e restrições. O chatbot responde e pode gerar um plano baseado no que pedes.",
    icon: FiSend,
  },
  {
    title: "Vê o plano",
    description:
      "Quando o plano é gerado, aparece um preview com lista de alimentos e totais de macronutrientes e calorias.",
    icon: FiTrendingUp,
  },
  {
    title: "Guarda o plano",
    description:
      "Clica em Guardar para adicionar à tua conta. Depois podes consultar em Perfil > Planos de Nutrição.",
    icon: FiBookmark,
  },
];

function StepList({ steps }) {
  return (
    <ol className="ff-how-steps">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="ff-how-step">
            <span className="ff-how-step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="ff-how-step-content">
              <div className="ff-how-step-heading">
                <h3>{step.title}</h3>
                <Icon aria-hidden="true" />
              </div>
              <p>{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const features = [
  {
    icon: FiClock,
    title: "Tudo organizado",
    description: "Séries, repetições e descanso num plano pronto a usar.",
  },
  {
    icon: FiBookmark,
    title: "Planos guardados",
    description:
      "Guarda os planos que queres repetir e volta a eles quando precisares.",
  },
  {
    icon: FiDownload,
    title: "Contigo, em PDF",
    description:
      "Exporta o teu treino e leva-o para o ginásio, mesmo sem internet.",
  },
  {
    icon: FiDatabase,
    title: "Sempre à mão",
    description: "Consulta os teus planos guardados diretamente no teu perfil.",
  },
];

export default function HowItWorks() {
  return (
    <div className="ff-help-page ff-how-page">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpBreadcrumb current="Como funciona" />
          <HelpReveal>
            <div className="ff-how-hero-grid">
              <div>
                <p className="ff-help-eyebrow">O teu guia Fit Fetch</p>
                <h1>
                  Uma rotina melhor.
                  <br />
                  <span>Um passo de cada vez.</span>
                </h1>
                <p className="ff-help-hero-description">
                  Descobre como criar, guardar e aproveitar os teus planos de
                  treino e nutrição. Do primeiro objetivo ao próximo treino,
                  começa por aqui.
                </p>
                <div className="ff-help-actions">
                  <Link
                    className="ff-help-button ff-help-button-primary"
                    to="/treinos"
                  >
                    Criar o meu treino <FiArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    className="ff-help-button ff-help-button-outline"
                    to="/faq"
                  >
                    Ver perguntas frequentes
                  </Link>
                </div>
              </div>
              <aside className="ff-how-overview" aria-label="O teu percurso">
                <p>DO OBJETIVO À AÇÃO</p>
                <ol>
                  <li>
                    <span aria-hidden="true">01</span>
                    <div>
                      <strong>Define o teu objetivo</strong>
                      <small>O plano começa contigo.</small>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true">02</span>
                    <div>
                      <strong>Cria o teu plano</strong>
                      <small>Treino e nutrição à tua medida.</small>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true">03</span>
                    <div>
                      <strong>Guarda e começa</strong>
                      <small>A tua próxima etapa, organizada.</small>
                    </div>
                  </li>
                </ol>
              </aside>
            </div>
          </HelpReveal>
        </div>
      </header>
      <nav className="ff-how-jump" aria-label="Nesta página">
        <div className="ff-help-wrap">
          <span>Neste guia</span>
          <a href="#como-treino">
            <LuDumbbell aria-hidden="true" /> Treino
          </a>
          <a href="#como-nutricao">
            <LuLeaf aria-hidden="true" /> Nutrição
          </a>
          <a href="#como-ferramentas">
            <FiBookmark aria-hidden="true" /> Os teus planos
          </a>
        </div>
      </nav>
      <div className="ff-help-wrap">
        <HelpReveal>
          <section
            id="como-treino"
            className="ff-how-section"
            aria-labelledby="ff-how-training-title"
            tabIndex={-1}
          >
            <div className="ff-how-section-intro">
              <span className="ff-help-icon">
                <LuDumbbell aria-hidden="true" />
              </span>
              <p className="ff-help-eyebrow">01 / Treino</p>
              <h2 id="ff-how-training-title">
                Do teu objetivo
                <br />
                ao teu plano.
              </h2>
              <p>
                Escolhe o teu foco e ajusta os detalhes. Segue estes cinco
                passos para teres um treino pronto a usar.
              </p>
              <Link className="ff-help-text-link" to="/treinos">
                Explorar treinos <FiArrowRight aria-hidden="true" />
              </Link>
              <div className="ff-how-note">
                <FiBookmark aria-hidden="true" />
                <p>
                  Queres manter um plano? Guarda-o antes de gerar o seguinte.
                </p>
              </div>
            </div>
            <StepList steps={trainingSteps} />
          </section>
        </HelpReveal>
        <HelpReveal>
          <section
            id="como-nutricao"
            className="ff-how-section ff-how-nutrition"
            aria-labelledby="ff-how-nutrition-title"
            tabIndex={-1}
          >
            <div className="ff-how-section-intro">
              <span className="ff-help-icon">
                <LuLeaf aria-hidden="true" />
              </span>
              <p className="ff-help-eyebrow">02 / Nutrição</p>
              <h2 id="ff-how-nutrition-title">
                Uma conversa.
                <br />
                Um novo equilíbrio.
              </h2>
              <p>
                Partilha os teus objetivos, preferências e restrições com o
                assistente de nutrição. Pede um plano e consulta os alimentos e
                totais antes de guardar.
              </p>
              <Link className="ff-help-text-link" to="/nutricao">
                Explorar nutrição <FiArrowRight aria-hidden="true" />
              </Link>
              <div className="ff-how-note">
                <FiMessageSquare aria-hidden="true" />
                <p>
                  Para começar, entra na tua conta e experimenta pedir “criar
                  plano”.
                </p>
              </div>
            </div>
            <StepList steps={nutritionSteps} />
          </section>
        </HelpReveal>
        <HelpReveal>
          <section
            id="como-ferramentas"
            className="ff-how-tools"
            aria-labelledby="ff-how-tools-title"
            tabIndex={-1}
          >
            <div className="ff-help-section-heading">
              <p className="ff-help-eyebrow">03 / Depois de criar</p>
              <h2 id="ff-how-tools-title">O teu plano. Sempre contigo.</h2>
              <p>Pequenos detalhes que tornam a tua rotina mais simples.</p>
            </div>
            <div className="ff-how-features">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title}>
                    <span className="ff-help-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </HelpReveal>
        <HelpReveal>
          <HelpContact
            title="Podemos ajudar no próximo passo."
            description="Se ainda tens dúvidas sobre o Fit Fetch, fala connosco."
          />
        </HelpReveal>
      </div>
    </div>
  );
}
