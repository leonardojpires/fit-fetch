import "./index.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function NotFound() {
  return (
    <section className="ff-not-found" aria-labelledby="not-found-title">
      <div className="ff-not-found-content">
        <p className="ff-not-found-code">404</p>
        <h1 id="not-found-title">Página não encontrada</h1>
        <p className="ff-not-found-description">
          A página que procuras não existe ou mudou de endereço.
        </p>
        <Link to="/" className="ff-not-found-home">
          <FiArrowLeft aria-hidden="true" /> Voltar ao início
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
