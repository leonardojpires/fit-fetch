import "./index.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiZap,
  FiSettings,
  FiFilter,
  FiTrendingUp,
  FiBookmark,
  FiClock,
  FiDownload,
  FiShield,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiDatabase,
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

const faqItems = [
  {
    question: "Preciso de conta para gerar um plano?",
    answer:
      "Sim, precisas estar autenticado (registado e com login feito). Isto garante que o teu plano fica guardado e seguro na tua conta.",
  },
  {
    question: "O que acontece se gerar um novo plano antes de guardar o anterior?",
    answer:
      "Se tinhas um plano não guardado, ele é automaticamente removido. Isto evita confusão. Se quiseres guardar, clica em 'Guardar Plano' antes de gerar um novo.",
  },
  {
    question: "Posso gerar vários planos até ficar perfeito?",
    answer:
      "Sim! Podes gerar quantas vezes quiseres. Como o sistema mistura os exercícios, cada vez pode resultar em planos diferentes.",
  },
  {
    question: "Como guardo um plano?",
    answer:
      "Quando vires o plano gerado, clica em 'Guardar Plano'. Fica guardado na tua conta e podes acedê-lo sempre que precisares.",
  },
  {
    question: "E os planos de nutrição?",
    answer:
      "Estão em desenvolvimento! Em breve vais poder gerar recomendações alimentares personalizadas ligadas aos teus treinos.",
  },
];

function HowItWorks() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="!mt-40 how-page">
      <div className="section !pt-16 !pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center items-center text-center !mb-12"
        >
          <div className="hiw-badge font-headline inline-block">
            <FiZap /> COMO FUNCIONA
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold leading-tight text-black !mt-4 !mb-4">
            Cria planos de treino em poucos cliques
          </h1>
          <p className="font-body text-black/70 text-xl max-w-2xl mx-auto !mb-6">
            Descobre como funciona, que regras garantem qualidade e como aproveitar cada plano.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/treinos" className="hiw-cta-primary font-headline">
              Começar agora <FiArrowRight />
            </Link>
            <a href="#faq" className="hiw-cta-secondary font-headline">
              Ver perguntas
            </a>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col gap-6 !mt-8">
          {/* Steps */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card"
          >
            <div className="glass-card-content">
              <h2 className="font-headline text-2xl font-bold text-black">
                5 passos simples
              </h2>

              <div className="flex flex-col gap-2 !mt-6">
                {trainingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="step-card">
                      <div className="flex items-start gap-3">
                        <div className="step-icon flex-shrink-0">
                          <Icon />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-headline text-base font-semibold text-black">
                            {index + 1}. {step.title}
                          </h3>
                          <p className="font-body text-gray-700 text-sm !mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.article>

          {/* Features */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card"
          >
            <div className="glass-card-content">
              <h2 className="font-headline text-2xl font-bold text-black">
                Tira o máximo partido
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 !mt-4">
                <div className="feature-item">
                  <div className="feature-icon">
                    <FiClock />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-black text-base">
                      Vê tudo organizado
                    </h3>
                    <p className="font-body text-gray-700 text-sm">
                      Séries, repetições, descanso — pronto para começar.
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <FiBookmark />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-black text-base">
                      Guarda favoritos
                    </h3>
                    <p className="font-body text-gray-700 text-sm">
                      Acumula planos e volta a qualquer um sempre.
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <FiDownload />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-black text-base">
                      Leva em PDF
                    </h3>
                    <p className="font-body text-gray-700 text-sm">
                      Exporta para a ginásio sem internet.
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <FiDatabase />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-black text-base">
                      Recupera anytime
                    </h3>
                    <p className="font-body text-gray-700 text-sm">
                      Todos os planos guardados na tua conta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </div>

        {/* FAQ */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="faq"
          className="glass-card !mt-8"
        >
          <div className="glass-card-content">
            <h2 className="font-headline text-2xl font-bold text-black">
              Perguntas frequentes
            </h2>
            <div className="flex flex-col gap-2 !mt-6">
              {faqItems.map((faq, index) => (
                <div key={faq.question} className="faq-item">
                  <button
                    type="button"
                    className="faq-button font-headline"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className="text-lg">{faq.question}</span>
                    <span className="faq-icon">
                      {openFaq === index ? <FiMinus /> : <FiPlus />}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div id={`faq-panel-${index}`} className="faq-answer">
                      <p className="font-body text-base text-black/70">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default HowItWorks;
