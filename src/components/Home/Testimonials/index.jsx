import TestimonialsCards from "./TestimonialsCards";
import testimonials from "./Testimonials";
import "./index.css";

export default function Testimonials() {
  return (
    <section
      className="ff-section ff-testimonials"
      aria-labelledby="ff-testimonials-title"
    >
      <div className="ff-wrap">
        <div className="ff-centered-intro">
          <p className="ff-eyebrow">03 / A nossa comunidade</p>
          <h2 id="ff-testimonials-title">
            Cada percurso tem <span>uma história.</span>
          </h2>
          <p className="ff-lead">
            Descobre o que os nossos membros dizem sobre o Fit Fetch.
          </p>
        </div>
        <div className="ff-testimonials-grid">
          {testimonials.map((t) => (
            <TestimonialsCards key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
