import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight, FiMessageCircle } from "react-icons/fi";
import "./index.css";

export function HelpReveal({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <Motion.div
      className="ff-help-reveal"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Motion.div>
  );
}

export function HelpBreadcrumb({ current }) {
  return (
    <nav className="ff-help-breadcrumb" aria-label="Localização">
      <ol>
        <li>
          <Link to="/">Início</Link>
        </li>
        <li>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}

export function HelpContact({ title, description }) {
  return (
    <section className="ff-help-contact" aria-label={title}>
      <span className="ff-help-contact-icon">
        <FiMessageCircle aria-hidden="true" />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link className="ff-help-button ff-help-button-light" to="/contacto">
        Fala connosco <FiArrowRight aria-hidden="true" />
      </Link>
    </section>
  );
}
