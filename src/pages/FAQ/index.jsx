import "./index.css";
import { useState } from "react";
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiUser,
  FiLayers,
  FiMessageCircle,
  FiBookOpen,
} from "react-icons/fi";
import {
  HelpReveal,
  HelpBreadcrumb,
  HelpContact,
} from "../../components/HelpPages";
import { LuLeaf } from "react-icons/lu";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "Preciso de conta para gerar planos?",
    answer:
      "Sim. Tens de estar autenticado para gerar e guardar planos de treino e de nutrição. Isto garante que ficam associados e seguros na tua conta.",
  },
  {
    question: "Como funciona o chatbot de nutrição?",
    answer:
      "Na página de Nutrição, escreves os teus objetivos e preferências (ex.: perder peso, evitar lactose, refeições rápidas). O assistente responde e, quando pedes um plano (ex.: 'criar plano'), mostra um preview com alimentos e totais de macronutrientes e calorias.",
  },
  {
    question: "Como guardo um plano de nutrição?",
    answer:
      "Depois de gerado, usa a opção de guardar para adicionar o plano à tua conta. Mais tarde podes consultar em Perfil > Planos de Nutrição.",
  },
  {
    question: "Posso gerar vários planos até ficar perfeito?",
    answer:
      "Sim! Podes gerar quantas vezes quiseres. Cada geração pode sugerir combinações diferentes, mantendo coerência com os teus critérios.",
  },
  {
    question:
      "O que acontece se gerar um novo plano antes de guardar o anterior?",
    answer:
      "Se tiveres um plano não guardado, ao gerar outro o anterior pode ser substituído. Se queres mantê-lo, guarda-o antes de gerar novamente.",
  },
  {
    question: "Os valores nutricionais ajustam à porção?",
    answer:
      "Sim. Os totais de proteínas, hidratos, gorduras e calorias são calculados a partir da porção e unidade do alimento no plano, garantindo valores realistas.",
  },
];

const faqGroups = [
  {
    id: "conta",
    title: "Conta e acesso",
    description: "O essencial para começares.",
    icon: FiUser,
    items: [0],
  },
  {
    id: "planos",
    title: "Os teus planos",
    description: "Cria, experimenta e guarda.",
    icon: FiLayers,
    items: [3, 4],
  },
  {
    id: "nutricao",
    title: "Nutrição",
    description: "Do assistente ao plano guardado.",
    icon: LuLeaf,
    items: [1, 2, 5],
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0);
  const toggleFaq = (index) =>
    setOpenFaq((previous) => (previous === index ? -1 : index));

  return (
    <div className="ff-help-page ff-faq-page">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpBreadcrumb current="Perguntas frequentes" />
          <HelpReveal>
            <div className="ff-faq-hero-grid">
              <div>
                <p className="ff-help-eyebrow">Estamos aqui para ajudar</p>
                <h1>
                  Perguntas frequentes.
                  <br />
                  <span>Respostas para avançares.</span>
                </h1>
                <p className="ff-help-hero-description">
                  Tudo o que precisas de saber para dar os primeiros passos,
                  criar planos e tirar mais partido do Fit Fetch.
                </p>
              </div>
              <div className="ff-faq-guide">
                <span className="ff-help-icon">
                  <FiBookOpen aria-hidden="true" />
                </span>
                <h2>É a tua primeira vez?</h2>
                <p>
                  Conhece o percurso, do primeiro objetivo ao plano pronto a
                  usar.
                </p>
                <Link to="/como-funciona">
                  Vê como funciona <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap">
        <div className="ff-faq-layout">
          <aside className="ff-faq-sidebar">
            <nav aria-label="Temas das perguntas">
              <p className="ff-help-eyebrow">Encontra a tua resposta</p>
              <ul>
                {faqGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <li key={group.id}>
                      <a href={`#faq-${group.id}`}>
                        <Icon aria-hidden="true" />
                        <span>{group.title}</span>
                        <span
                          className="ff-faq-count"
                          aria-label={`${group.items.length} perguntas`}
                        >
                          {group.items.length}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="ff-faq-sidebar-note">
              <FiMessageCircle aria-hidden="true" />
              <h2>Ainda tens dúvidas?</h2>
              <p>Conta-nos como podemos ajudar.</p>
              <Link className="ff-help-text-link" to="/contacto">
                Entrar em contacto <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
          <div className="ff-faq-groups">
            {faqGroups.map((group) => (
              <HelpReveal key={group.id}>
                <section
                  id={`faq-${group.id}`}
                  className="ff-faq-group"
                  aria-labelledby={`faq-heading-${group.id}`}
                  tabIndex={-1}
                >
                  <div className="ff-faq-group-heading">
                    <h2 id={`faq-heading-${group.id}`}>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                  <div className="ff-faq-questions">
                    {group.items.map((index) => {
                      const faq = faqItems[index];
                      return (
                        <article
                          key={faq.question}
                          className="ff-faq-item"
                          data-open={openFaq === index}
                        >
                          <h3>
                            <button
                              id={`faq-trigger-${index}`}
                              type="button"
                              className="ff-faq-button"
                              onClick={() => toggleFaq(index)}
                              aria-expanded={openFaq === index}
                              aria-controls={`faq-panel-${index}`}
                            >
                              <span>{faq.question}</span>
                              <span className="ff-faq-toggle">
                                {openFaq === index ? (
                                  <FiMinus aria-hidden="true" />
                                ) : (
                                  <FiPlus aria-hidden="true" />
                                )}
                              </span>
                            </button>
                          </h3>
                          <div
                            id={`faq-panel-${index}`}
                            className="ff-faq-answer"
                            role="region"
                            aria-labelledby={`faq-trigger-${index}`}
                            hidden={openFaq !== index}
                          >
                            <p>{faq.answer}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </HelpReveal>
            ))}
          </div>
        </div>
        <HelpReveal>
          <HelpContact
            title="A tua pergunta não está aqui?"
            description="Entra em contacto e diz-nos em que podemos ajudar."
          />
        </HelpReveal>
      </div>
    </div>
  );
}
