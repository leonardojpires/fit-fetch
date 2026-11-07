import aboutData from "./aboutData";
import "./index.css";

export default function About() {
  return (
    <section
      id="sobre"
      className="ff-section ff-about"
      aria-labelledby="ff-about-title"
      tabIndex={-1}
    >
      <div className="ff-wrap">
        <div className="ff-section-intro">
          <div>
            <p className="ff-eyebrow">01 / Sobre nós</p>
            <h2 id="ff-about-title">
              O teu bem-estar.
              <br />
              <span>Um só lugar.</span>
            </h2>
          </div>
          <p className="ff-lead">
            O Fit Fetch reúne treino e nutrição para te ajudar a construir uma
            rotina mais equilibrada. Descobre as ferramentas para cuidares de
            ti, ao teu ritmo.
          </p>
        </div>
        <div className="ff-about-grid">
          {aboutData.map(({ id, icon, title, description }) => {
            const Icon = icon;
            return (
              <article key={id} className="ff-about-card">
                <div className="ff-about-card-top">
                  <span className="ff-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="ff-card-number" aria-hidden="true">
                    0{id}
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
