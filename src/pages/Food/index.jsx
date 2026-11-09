import { Link, useNavigate, useParams } from "react-router-dom";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import { FaArrowLeft } from "react-icons/fa";
import { HelpReveal } from "../../components/HelpPages";
import "../../components/CatalogDetails/index.css";
import "./index.css";
import useGetFoodById from "../../hooks/Foods/useGetFoodById";

function Food() {
  const { id } = useParams();
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { food, loadingFood, error } = useGetFoodById(id);
  const navigate = useNavigate();

  if (authLoading || loadingFood) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar alimento...</p>
        </div>
      </section>
    );
  }

  if (error || !food) {
    return (
      <section className="loading-section">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-lg text-red-600">
              Erro ao carregar alimento
            </p>
            <p className="font-body text-sm text-gray-600">
              {error || "Alimento não encontrado"}
            </p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="font-body text-[var(--primary)] hover:underline"
            >
              Voltar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="ff-help-page ff-catalog-page ff-food-page">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpReveal>
            <div className="ff-catalog-title">
              <div className="ff-catalog-title-row">
                <Link
                  to=".."
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                  className="food-back-button"
                >
                  <FaArrowLeft aria-hidden="true" /> Voltar
                </Link>
                <h1 className="ff-catalog-name">
                  {food?.name || "Nome do Alimento"}
                </h1>
              </div>
              <p className="ff-help-hero-description">Detalhes do alimento</p>
            </div>

            <div className="badge-container">
              <span className="badge-category font-body">
                {food?.category || "Categoria"}
              </span>
              <span className="badge-serving font-body">
                {food?.serving_size || "100"} {food?.unit || "g"}
              </span>
              <span className="badge-calories font-body">
                {food?.calories || "0"} kcal
              </span>
            </div>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap ff-catalog-content">
        <HelpReveal>
          {/* NUTRITION INFO AND MACROS */}
          <div className="ff-catalog-grid">
            {/* Macronutrients Cards */}
            <div className="macros-section">
              <h2 className="section-title font-heading">Macronutrientes</h2>
              <p className="ff-catalog-support">
                Por porção de {food?.serving_size || "100"} {food?.unit || "g"}
              </p>
              <div className="macros-grid">
                <div className="macro-card macro-protein">
                  <div className="macro-icon" aria-hidden="true">
                    🥩
                  </div>
                  <div className="macro-content">
                    <p className="macro-label font-body">PROTEÍNA</p>
                    <span className="macro-value font-body">
                      {food?.protein || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-carbs">
                  <div className="macro-icon" aria-hidden="true">
                    🍞
                  </div>
                  <div className="macro-content">
                    <p className="macro-label font-body">HIDRATOS DE CARBONO</p>
                    <span className="macro-value font-body">
                      {food?.carbs || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-fat">
                  <div className="macro-icon" aria-hidden="true">
                    🥑
                  </div>
                  <div className="macro-content">
                    <p className="macro-label font-body">GORDURA</p>
                    <span className="macro-value font-body">
                      {food?.fat || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-fiber">
                  <div className="macro-icon" aria-hidden="true">
                    🌾
                  </div>
                  <div className="macro-content">
                    <p className="macro-label font-body">FIBRA</p>
                    <span className="macro-value font-body">
                      {food?.fiber || "0"}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="info-section">
              <h2 className="section-title font-heading">Informações</h2>
              <div className="info-container">
                <div className="info-item">
                  <p className="info-label font-body">CATEGORIA</p>
                  <span className="info-value font-body">
                    {food?.category || "Sem categoria"}
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">PORÇÃO</p>
                  <span className="info-value font-body">
                    {food?.serving_size || "100"} {food?.unit || "g"}
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">CALORIAS TOTAIS</p>
                  <span className="info-value font-body">
                    {food?.calories || "0"} kcal
                  </span>
                </div>
                <div className="info-item">
                  <p className="info-label font-body">ADICIONADO A</p>
                  <span className="info-value font-body">
                    {food?.created_at
                      ? new Date(food.created_at).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutritional Breakdown */}
          <div className="nutritional-breakdown">
            <h2 className="section-title font-heading">Valor Nutricional</h2>
            <dl className="nutritional-table">
              <div className="table-row">
                <dt className="table-label font-body">Calorias</dt>
                <dd className="table-value font-body">
                  {food?.calories || "0"} kcal
                </dd>
              </div>
              <div className="table-row">
                <dt className="table-label font-body">Proteína</dt>
                <dd className="table-value font-body">
                  {food?.protein || "0"}g
                </dd>
              </div>
              <div className="table-row">
                <dt className="table-label font-body">Hidratos de carbono</dt>
                <dd className="table-value font-body">{food?.carbs || "0"}g</dd>
              </div>
              <div className="table-row">
                <dt className="table-label font-body">Fibra</dt>
                <dd className="table-value font-body">{food?.fiber || "0"}g</dd>
              </div>
              <div className="table-row">
                <dt className="table-label font-body">Gordura</dt>
                <dd className="table-value font-body">{food?.fat || "0"}g</dd>
              </div>
            </dl>
            <p className="nutritional-note font-body">
              * Valores nutricionais baseados em {food?.serving_size || "100"}{" "}
              {food?.unit || "g"} do alimento
            </p>
          </div>
        </HelpReveal>
      </div>
    </div>
  );
}

export default Food;
