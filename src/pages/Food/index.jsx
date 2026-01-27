import { Link, useNavigate, useParams } from "react-router-dom";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
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
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
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
    <motion.section
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="section !mt-40 !mb-40 flex flex-col gap-10">
        <div className="containers">
          <div className="food-header overflow-x-auto">
            <div className="food-title-container">
              <div className="flex flex-row items-center gap-3">
                <Link
                  to=".."
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                  className="food-back-button"
                >
                  <FaArrowLeft />
                </Link>
                <h1 className="font-headline font-bold text-2xl">
                  {food?.name || "Nome do Alimento"}
                </h1>
              </div>
              <p className="font-body text-black/70">Detalhes do alimento</p>
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
          </div>

          {/* NUTRITION INFO AND MACROS */}
          <div className="flex flex-col md:flex-row md:flex-nowrap justify-center items-start gap-3 overflow-x-auto w-full !px-6 !mb-6">
            {/* Macronutrients Cards */}
            <div className="macros-section">
              <h2 className="section-title font-heading">Macronutrientes</h2>
              <div className="macros-grid">
                <div className="macro-card macro-protein">
                  <div className="macro-icon">🥩</div>
                  <div className="macro-content">
                    <p className="macro-label font-body">PROTEÍNA</p>
                    <span className="macro-value font-body">
                      {food?.protein || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-carbs">
                  <div className="macro-icon">🍞</div>
                  <div className="macro-content">
                    <p className="macro-label font-body">CARBOIDRATOS</p>
                    <span className="macro-value font-body">
                      {food?.carbs || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-fat">
                  <div className="macro-icon">🥑</div>
                  <div className="macro-content">
                    <p className="macro-label font-body">GORDURA</p>
                    <span className="macro-value font-body">
                      {food?.fat || "0"}g
                    </span>
                  </div>
                </div>
                <div className="macro-card macro-fiber">
                  <div className="macro-icon">🌾</div>
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
            <div className="nutritional-table">
              <div className="table-row">
                <span className="table-label font-body">Calorias</span>
                <span className="table-value font-body">
                  {food?.calories || "0"} kcal
                </span>
              </div>
              <div className="table-row">
                <span className="table-label font-body">Proteína</span>
                <span className="table-value font-body">
                  {food?.protein || "0"}g
                </span>
              </div>
              <div className="table-row">
                <span className="table-label font-body">Carboidratos</span>
                <span className="table-value font-body">
                  {food?.carbs || "0"}g
                </span>
              </div>
              <div className="table-row">
                <span className="table-label font-body">Fibra</span>
                <span className="table-value font-body">
                  {food?.fiber || "0"}g
                </span>
              </div>
              <div className="table-row">
                <span className="table-label font-body">Gordura</span>
                <span className="table-value font-body">
                  {food?.fat || "0"}g
                </span>
              </div>
            </div>
            <p className="nutritional-note font-body">
              * Valores nutricionais baseados em {food?.serving_size || "100"}{" "}
              {food?.unit || "g"} do alimento
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Food;
