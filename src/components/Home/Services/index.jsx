import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Cards from "./Cards";
import services from "./servicesData";
import "./index.css";

export default function Services() {
  return (
    <section
      id="servicos"
      className="ff-section ff-services"
      aria-labelledby="ff-services-title"
      tabIndex={-1}
    >
      <div className="ff-wrap">
        <div className="ff-section-intro">
          <div>
            <p className="ff-eyebrow">02 / À tua medida</p>
            <h2 id="ff-services-title">
              Tudo para dares
              <br />
              <span>o próximo passo.</span>
            </h2>
          </div>
          <div>
            <p className="ff-lead">
              Do primeiro treino à organização dos teus planos, encontra as
              ferramentas que acompanham a tua evolução.
            </p>
            <Link className="ff-text-link" to="/como-funciona">
              Como funciona <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="ff-services-grid">
          {services.map((service, index) => (
            <Cards key={service.title} {...service} number={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
