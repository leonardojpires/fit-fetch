import { FiStar } from "react-icons/fi";

export default function TestimonialsCards({ name, image, stars, text }) {
  return (
    <figure className="ff-testimonial">
      <span
        className="ff-rating"
        role="img"
        aria-label={`${stars} de 5 estrelas`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <FiStar
            key={index}
            aria-hidden="true"
            className={index < stars ? "ff-star-filled" : ""}
          />
        ))}
      </span>
      <blockquote>
        <p>“{text}”</p>
      </blockquote>
      <figcaption>
        <img src={image} alt="" loading="lazy" width="44" height="44" />
        <div>
          <span className="ff-member-name">{name}</span>
          <span className="ff-member-caption">Membro Fit Fetch</span>
        </div>
      </figcaption>
    </figure>
  );
}
