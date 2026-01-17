import "./index.css";
import { SlEnergy } from "react-icons/sl";
import { IoNutritionOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import useRedirectIfNotAuth from "./../../hooks/useIfNotAuth";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase.js";
import WorkoutPlanPreview from "../../components/WorkoutPlanPreview/index.jsx";
import NutritionPlanPreview from "../../components/NutritionPlanPreview/index.jsx";
import useRemoveWorkoutPlan from './../../hooks/WorkoutPlan/useRemoveWorkoutPlan';
import useRemoveNutritionPlan from '../../hooks/Nutrition/useRemoveNutritionPlan';
import EditProfileModal from "../../components/EditProfileModal/index.jsx";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useUpdateCurrentUser from "../../hooks/Users/useUpdateCurrentUser.jsx";
import SuccessWarning from "../../components/SuccessWarning/index.jsx";
import { motion } from "framer-motion";

function Profile() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { user, setUser, loading: userLoading } = useCurrentUser();
  const [planType, setPlanType] = useState("workout");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitText, setSubmitText] = useState("Guardar Alterações");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessWarning, setShowSuccessWarning] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(null);
  const saveChanges = useUpdateCurrentUser();
  const removePlan = useRemoveWorkoutPlan();
  const removeNutritionPlan = useRemoveNutritionPlan();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPlans = async () => {
      if (!user) return;

      try {
        const token = await auth.currentUser.getIdToken();

        const workoutResponse = await fetch(
          `http://localhost:3000/api/workout-plans/user/plans`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const nutritionResponse = await fetch(
          `http://localhost:3000/api/nutrition-plans/user/plans`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (workoutResponse.ok && nutritionResponse.ok) {
          const workoutData = await workoutResponse.json();
          setWorkoutPlans(workoutData.plans || []);
          const nutritionData = await nutritionResponse.json();
          setNutritionPlans(nutritionData.plans || []);
        }
      } catch (err) {
        console.error("Erro ao buscar planos do utilizador: ", err);
      }
    };

    fetchUserPlans();
  }, [user]);

  async function handleDeletePlan(planId) {
    setIsDeletingPlan(planId);
    try {
      const result = await removePlan(planId);
      if (result) {
        setSuccessMessage("Plano removido com sucesso!");
        setShowSuccessWarning(true);
        setWorkoutPlans((prevPlans) => prevPlans.filter(plan => plan.id !== planId));
      }
    } finally {
      setIsDeletingPlan(null);
    }
  }

  async function handleDeleteNutritionPlan(planId) {
    setIsDeletingPlan(planId);
    try {
      const result = await removeNutritionPlan(planId);
      if (result) {
        setSuccessMessage("Plano removido com sucesso!");
        setShowSuccessWarning(true);
        setNutritionPlans((prevPlans) => prevPlans.filter(plan => plan.id !== planId));
      }
    } finally {
      setIsDeletingPlan(null);
    }
  }

  const handlePlanTypeChange = (type) => {
    setPlanType(type);
  };

  if (authLoading || userLoading) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-lg">A carregar perfil...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = new Date().getFullYear();

  const updateProfile = async (e, avatarFile) => {
    e.preventDefault();
    setSubmitText("A guardar...");

    const formData = {
      name: e.target.name.value,
      avatar: avatarFile
    }

    if (!formData.name) throw new Error("O nome é obrigatório!");
    const prevUser = user;
    setUser((u) => ({ ...u, ...formData }));

    try {
      const result = await saveChanges(formData);

      if (!result) throw new Error("Erro ao atualizar perfil");
      if (result.avatarUrl) {
        setUser((u) => ({ ...u, avatarUrl: `http://localhost:3000${result.avatarUrl}` }));
      }

      setIsEditModalOpen(false);
      setSubmitText("Guardar Alterações");
      setSuccessMessage("Perfil atualizado com sucesso!");
      setShowSuccessWarning(true);
    } catch(err) {
      setUser(prevUser);
      console.error("Erro ao atualizar perfil: ", err);
      return;
    }
  }

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  }

  if (showSuccessWarning) {
    setTimeout(() => {
      closeSuccessWarning();
    }, 3000);
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
        {/* PROFILE CONTAINER */}
        <div className="containers">
          <div className="h-48 bg-[var(--primary)] relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="relative !px-8 !pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 !-mt-20">
              <div className="relative">
                <img
                  src={user.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:3000${user.avatarUrl}`) : defaultAvatar}
                  alt={`Foto de perfil de ${user.name}`}
                  className="w-48 h-48 object-cover rounded-full border-6 border-white shadow-lg pointer-events-none"
                />
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start justify-start text-center !mt-0 w-full">
                <h1 className="font-headline font-bold text-3xl !mb-2">
                  {user.name}
                </h1>
                <p className="font-body font-medium text-black/70 !mb-2">
                  Membro desde {memberSince}
                </p>
                <span className="font-body font-medium text-black/50 text-sm">
                  {user.email}
                </span>
              </div>
              <div>
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="font-body bg-[var(--primary)] !px-8 !py-3 text-white hover:bg-[var(--accent)] transition-all ease-in-out duration-200 cursor-pointer rounded-xl"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE MODAL */}
        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          defaultAvatar={defaultAvatar}
          newAvatar = {user.avatarUrl || null}
          submitText={submitText}
          saveChanges={updateProfile}
        />

        {/* STATS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="stats-container font-body">
            <div className="font-bold bg-[var(--primary)]/20 text-[var(--primary)] text-2xl !p-3 rounded-lg">
              <SlEnergy aria-hidden="true" focusable="false" />
            </div>

            <div>
              <span className="font-bold text-3xl">{workoutPlans.length}</span>
              <p className="text-sm text-black/70">Planos de Treino</p>
            </div>
          </div>

          <div className="stats-container font-body">
            <div className="font-bold bg-[var(--secondary)]/20 text-[var(--secondary)] text-2xl !p-3 rounded-lg">
              <IoNutritionOutline aria-hidden="true" focusable="false" />
            </div>

            <div>
              <span className="font-bold text-3xl">{nutritionPlans.length}</span>
              <p className="text-sm text-black/70">Planos de Nutrição</p>
            </div>
          </div>
        </div>

        {/* PLANS CONTAINER */}
        <div className="containers">
          <div className="flex flex-col gap-4 !p-6">
            <div className="flex flex-col gap-2 border-b-2 border-gray-200/50 !pb-4 !mb-6">
              <h2 className="font-headline font-bold text-2xl">
                Os Meus Planos
              </h2>
              <p className="font-body font-medium text-black/70">
                Gerir os teus planos de treino e de alimentação
              </p>
            </div>

            <div className="flex flex-row gap-8 font-body text-lg border-b border-gray-200/50 !mb-6">
              <button
                type="button"
                onClick={() => handlePlanTypeChange("workout")}
                className={`!pb-2 !px-4 cursor-pointer ${
                  planType === "workout" ? "selected-plan" : ""
                }`}
                aria-pressed={planType === "workout"}
              >
                Planos de Treino
              </button>
              <button
                type="button"
                onClick={() => handlePlanTypeChange("nutrition")}
                className={`!pb-2 !px-4 cursor-pointer ${
                  planType === "nutrition" ? "selected-plan" : ""
                }`}
                aria-pressed={planType === "nutrition"}
              >
                Planos de Alimentação
              </button>
            </div>

            <div>
              {planType === "workout" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutPlans.length > 0 ? (
                    workoutPlans.map((plan) => (
                      <WorkoutPlanPreview key={plan.id} plan={plan} onDeletePlan={() => handleDeletePlan(plan.id)} />
                    ))
                  ) : (
                    <p className="font-body text-black/50">
                      Ainda não tens planos de treino.
                    </p>
                  )}
                </div>
              ) : planType === "nutrition" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nutritionPlans.length > 0 ? (
                    nutritionPlans.map((plan) => (
                      <NutritionPlanPreview key={plan.id} plan={plan} onDeletePlan={() => handleDeleteNutritionPlan(plan.id)} />
                    ))
                  ) : (
                    <p className="font-body text-black/50">
                      Ainda não tens planos de alimentação.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      { showSuccessWarning && (
        <SuccessWarning message={successMessage} closeWarning={closeSuccessWarning} />
      ) }

    </motion.section>
  );
}

export default Profile;
