import "./index.css";
import { useState } from "react";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const faqItems = [
  {
    question: "Preciso de conta para gerar um plano?",
    answer:
      "Sim, precisas estar autenticado (registado e com login feito). Isto garante que o teu plano fica guardado e seguro na tua conta.",
  },
  {
    question:
      "O que acontece se gerar um novo plano antes de guardar o anterior?",
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

function FAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="w-full">
      <div className="section !mt-40 !py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center items-center text-center !mb-12"
        >
          <h1 className="font-headline text-4xl md:text-5xl font-bold leading-tight text-black !mt-4 !mb-4">
            Dúvidas Frequentes
          </h1>
          <p className="font-body text-black/70 text-xl max-w-2xl mx-auto !mb-6">
            Encontra as respostas às perguntas mais comuns sobre a plataforma e como tirar o máximo proveito dela
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          id="faq"
          className="glass-card !mt-4"
        >
          <div className="glass-card-content">
            <div className="flex flex-col gap-2">
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

export default FAQ;
