export default function Cards({ icon, title, description, number }) {
  return (
    <article className="ff-service-card">
      <div className="ff-service-image">
        <img src={icon} alt="" loading="lazy" width="384" height="216" />
        <span aria-hidden="true">0{number}</span>
      </div>
      <div className="ff-service-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
