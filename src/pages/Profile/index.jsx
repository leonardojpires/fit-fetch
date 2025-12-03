import "./index.css";
import { SlEnergy } from "react-icons/sl";
import { IoNutritionOutline } from "react-icons/io5";
import { useState } from "react";

function Profile() {
  const [planType, setPlanType] = useState("workout");

  const handlePlanTypeChange = (type) => {
    setPlanType(type);
  }

  return (
    <section className="w-full">
      <div className="section !mt-40 !mb-40 flex flex-col gap-10">

        {/* PROFILE CONTAINER */}
        <div className="containers">
          <div className="h-48 bg-[var(--primary)] relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="relative !px-8 !pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 !-mt-20">
              <div className="relative">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg"
                  alt="Profile image"
                  className="w-48 h-48 object-cover rounded-full border-6 border-white shadow-lg pointer-events-none"
                />
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start justify-start text-center !mt-0 w-full">
                <h1 className="font-headline font-bold text-3xl !mb-2">
                  Nome do Utilizador
                </h1>
                <p className="font-body font-medium text-black/70 !mb-2">
                  Membro desde 2025
                </p>
                <span className="font-body font-medium text-black/50 text-sm">
                  utilizador@email.com
                </span>
              </div>
              <div>
                <button className="font-body bg-[var(--primary)] !px-8 !py-3 text-white hover:bg-[var(--accent)] transition-all ease-in-out duration-200 cursor-pointer rounded-xl">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="stats-container font-body">

            <div className="font-bold bg-[var(--primary)]/20 text-[var(--primary)] text-2xl !p-3 rounded-lg">
              <SlEnergy />
            </div>

            <div>
              <span className="font-bold text-3xl">24</span>
              <p className="text-sm text-black/70">Planos de Treino</p>
            </div>

          </div>

          <div className="stats-container font-body">

            <div className="font-bold bg-[var(--secondary)]/20 text-[var(--secondary)] text-2xl !p-3 rounded-lg">
              <IoNutritionOutline />
            </div>

            <div>
              <span className="font-bold text-3xl">18</span>
              <p className="text-sm text-black/70">Planos de Nutrição</p>
            </div>

          </div>
          
        </div>

        {/* PLANS CONTAINER */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">

            <div className="flex flex-col gap-2 border-b-2 border-gray-200/50 !pb-4 !mb-6">
              <h2 className="font-headline font-bold text-2xl">Os Meus Planos</h2>
              <p className="font-body font-medium text-black/70">Gerir os teus planos de treino e de alimentação</p>
            </div>

            <div className="flex flex-row gap-8 font-body text-lg border-b border-gray-200/50 !mb-6">
                <button onClick={() => handlePlanTypeChange("workout")} className={`!pb-2 !px-4 cursor-pointer ${planType === "workout" ? "selected-plan" : ""}`}>Planos de Treino</button>
                <button onClick={() => handlePlanTypeChange("nutrition")} className={`!pb-2 !px-4 cursor-pointer ${planType === "nutrition" ? "selected-plan" : ""}`}>Planos de Alimentação</button>
            </div>

            <div>
              { planType === "workout" ? (
                <span>Treino</span>
              ) : planType === "nutrition" ? (
                <span>Nutrição</span>
              ) : () => {}}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
