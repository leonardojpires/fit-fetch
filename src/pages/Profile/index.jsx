import "./index.css";
import { SlEnergy } from "react-icons/sl";
import { IoNutritionOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import useRedirectIfNotAuth from "./../../hooks/useIfNotAuth";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase.js";
import PlanPreview from "../../components/PlanPreview/index.jsx";
import useRemoveWorkoutPlan from './../../hooks/WorkoutPlan/useRemoveWorkoutPlan';
import EditProfileModal from "../../components/EditProfileModal/index.jsx";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useUpdateUser from './../../hooks/Users/useUpdateUser';

function Profile() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { user, setUser, loading: userLoading } = useCurrentUser();
  const [planType, setPlanType] = useState("workout");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitText, setSubmitText] = useState("Guardar Alterações");
  const saveChanges = useUpdateUser();
  const removePlan = useRemoveWorkoutPlan();
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

        if (workoutResponse.ok) {
          const workoutData = await workoutResponse.json();
          setWorkoutPlans(workoutData.plans || []);
        }
      } catch (err) {
        console.error("Erro ao buscar planos do utilizador: ", err);
      }
    };

    fetchUserPlans();
  }, [user]);

  async function handleDeletePlan(planId) {
    const result = await removePlan(planId);
    if (result) {
      setWorkoutPlans((prevPlans) => prevPlans.filter(plan => plan.id !== planId));
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

  const updateProfile = async (e) => {
    e.preventDefault();
    setSubmitText("A guardar...");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
    }

    if (!formData.name || !formData.email) throw new Error("O nome e o email são obrigatórios!");
    const prevUser = user;
    setUser((u) => ({ ...u, ...formData }));

    try {
      const result = await saveChanges(user.id, formData);
      if (!result) throw new Error("Erro ao atualizar perfil");
      setIsEditModalOpen(false);
      setSubmitText("Guardar Alterações");
    } catch(err) {
      setUser(prevUser);
      console.error("Erro ao atualizar perfil: ", err);
      return;
    }
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
                  src={user.avatarUrl || defaultAvatar}
                  alt="Profile image"
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
          submitText={submitText}
          saveChanges={updateProfile}
        />

        {/* STATS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="stats-container font-body">
            <div className="font-bold bg-[var(--primary)]/20 text-[var(--primary)] text-2xl !p-3 rounded-lg">
              <SlEnergy />
            </div>

            <div>
              <span className="font-bold text-3xl">{workoutPlans.length}</span>
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
              <h2 className="font-headline font-bold text-2xl">
                Os Meus Planos
              </h2>
              <p className="font-body font-medium text-black/70">
                Gerir os teus planos de treino e de alimentação
              </p>
            </div>

            <div className="flex flex-row gap-8 font-body text-lg border-b border-gray-200/50 !mb-6">
              <button
                onClick={() => handlePlanTypeChange("workout")}
                className={`!pb-2 !px-4 cursor-pointer ${
                  planType === "workout" ? "selected-plan" : ""
                }`}
              >
                Planos de Treino
              </button>
              <button
                onClick={() => handlePlanTypeChange("nutrition")}
                className={`!pb-2 !px-4 cursor-pointer ${
                  planType === "nutrition" ? "selected-plan" : ""
                }`}
              >
                Planos de Alimentação
              </button>
            </div>

            <div>
              {planType === "workout" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutPlans.length > 0 ? (
                    workoutPlans.map((plan) => (
                      <PlanPreview key={plan.id} plan={plan} onDeletePlan={() => handleDeletePlan(plan.id)} />
                    ))
                  ) : (
                    <p className="font-body text-black/50">
                      Ainda não tens planos de treino.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {nutritionPlans.length > 0 ? (
                    <span>Lista de planos de nutrição</span>
                  ) : (
                    <p className="font-body text-black/50">
                      Ainda não tens planos de alimentação.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
