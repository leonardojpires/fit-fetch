import "./index.css";
import { SlEnergy } from "react-icons/sl";
import { IoNutritionOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import useRedirectIfNotAuth from "./../../hooks/useIfNotAuth";
import useCurrentUser from "../../hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase.js";
import WorkoutPlanPreview from "../../components/WorkoutPlanPreview/index.jsx";
import NutritionPlanPreview from "../../components/NutritionPlanPreview/index.jsx";
import useRemoveWorkoutPlan from "./../../hooks/WorkoutPlan/useRemoveWorkoutPlan";
import useRemoveNutritionPlan from "../../hooks/Nutrition/useRemoveNutritionPlan";
import EditProfileModal from "../../components/EditProfileModal/index.jsx";
import DeleteModal from "../../components/DeleteModal/index.jsx";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useUpdateCurrentUser from "../../hooks/Users/useUpdateCurrentUser.jsx";
import SuccessWarning from "../../components/SuccessWarning/index.jsx";
import { HelpBreadcrumb, HelpReveal } from "../../components/HelpPages";
import { FiArrowRight, FiEdit2, FiPlus, FiHelpCircle } from "react-icons/fi";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
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
          },
        );

        const nutritionResponse = await fetch(
          `http://localhost:3000/api/nutrition-plans/user/plans`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (workoutResponse.ok && nutritionResponse.ok) {
          const workoutData = await workoutResponse.json();
          setWorkoutPlans(workoutData.plans || []);
          const nutritionData = await nutritionResponse.json();
          setNutritionPlans(nutritionData.plans || []);
        }
      } catch (err) {
        // console.error("Erro ao buscar planos do utilizador: ", err);
      }
    };

    fetchUserPlans();
  }, [user]);

  if (authLoading || userLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  function openDeleteModal(plan, type) {
    setPlanToDelete({ ...plan, type });
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  }

  async function confirmDeletePlan() {
    if (!planToDelete) return;

    setIsDeletingPlan(planToDelete.id);
    try {
      if (planToDelete.type === "workout") {
        const result = await removePlan(planToDelete.id);
        if (result) {
          setSuccessMessage("Plano removido com sucesso!");
          setShowSuccessWarning(true);
          setWorkoutPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== planToDelete.id),
          );
        }
      } else if (planToDelete.type === "nutrition") {
        const result = await removeNutritionPlan(planToDelete.id);
        if (result) {
          setSuccessMessage("Plano removido com sucesso!");
          setShowSuccessWarning(true);
          setNutritionPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== planToDelete.id),
          );
        }
      }
    } finally {
      setIsDeletingPlan(null);
      closeDeleteModal();
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
      avatar: avatarFile,
    };

    if (!formData.name) throw new Error("O nome é obrigatório!");
    const prevUser = user;
    setUser((u) => ({ ...u, ...formData }));

    try {
      const result = await saveChanges(formData);

      if (!result) throw new Error("Erro ao atualizar perfil");
      if (result.avatarUrl) {
        setUser((u) => ({
          ...u,
          avatarUrl: `http://localhost:3000${result.avatarUrl}`,
        }));
      }

      setIsEditModalOpen(false);
      setSubmitText("Guardar Alterações");
      setSuccessMessage("Perfil atualizado com sucesso!");
      setShowSuccessWarning(true);
    } catch (err) {
      setUser(prevUser);
      // console.error("Erro ao atualizar perfil: ", err);
      return;
    }
  };

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  };

  if (showSuccessWarning) {
    setTimeout(() => {
      closeSuccessWarning();
    }, 3000);
  }

  return (
    <div className="ff-help-page ff-profile-page">
      <header className="ff-help-hero">
        <div className="ff-help-wrap">
          <HelpBreadcrumb current="O meu perfil" />
          <HelpReveal>
            <div className="ff-profile-identity">
              <div className="ff-profile-avatar">
                <img
                  src={
                    user.avatarUrl
                      ? user.avatarUrl.startsWith("http")
                        ? user.avatarUrl
                        : `http://localhost:3000${user.avatarUrl}`
                      : defaultAvatar
                  }
                  alt={`Foto de perfil de ${user.name}`}
                  width="112"
                  height="112"
                />
              </div>
              <div className="ff-profile-intro">
                <p className="ff-help-eyebrow">A tua área pessoal</p>
                <h1>{user.name}</h1>
                <p className="ff-profile-email">{user.email}</p>
                <p className="ff-profile-member">Membro desde {memberSince}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="ff-profile-edit"
              >
                <FiEdit2 aria-hidden="true" /> Editar perfil
              </button>
            </div>
          </HelpReveal>
        </div>
      </header>
      <div className="ff-help-wrap ff-profile-content">
        <HelpReveal>
          <section
            className="ff-profile-overview"
            aria-label="Os teus planos guardados"
          >
            <div className="ff-profile-stat">
              <span className="ff-profile-stat-icon">
                <SlEnergy aria-hidden="true" />
              </span>
              <div>
                <span className="ff-profile-stat-value">
                  {workoutPlans.length}
                </span>
                <h2>Planos de treino</h2>
                <p>Guardados na tua conta</p>
              </div>
            </div>
            <div className="ff-profile-stat ff-profile-stat-nutrition">
              <span className="ff-profile-stat-icon">
                <IoNutritionOutline aria-hidden="true" />
              </span>
              <div>
                <span className="ff-profile-stat-value">
                  {nutritionPlans.length}
                </span>
                <h2>Planos de nutrição</h2>
                <p>Guardados na tua conta</p>
              </div>
            </div>
            <div className="ff-profile-guide">
              <span className="ff-help-eyebrow">O próximo passo é teu</span>
              <h2>Continua a cuidar de ti.</h2>
              <p>Cria um novo plano ou retoma um dos teus favoritos.</p>
              <Link to="/como-funciona">
                Explorar o guia <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </section>
        </HelpReveal>
        <div className="ff-profile-workspace">
          <section
            className="ff-profile-library"
            aria-labelledby="ff-profile-library-title"
          >
            <div className="ff-profile-library-heading">
              <div>
                <p className="ff-help-eyebrow">A tua coleção</p>
                <h2 id="ff-profile-library-title">Os meus planos</h2>
                <p>
                  Organiza os teus treinos e a tua alimentação num só lugar.
                </p>
              </div>
              <Link
                className="ff-profile-create"
                to={planType === "workout" ? "/treinos" : "/nutricao"}
              >
                <FiPlus aria-hidden="true" /> Criar plano
              </Link>
            </div>
            <div
              className="ff-profile-filters"
              role="group"
              aria-label="Tipo de plano"
            >
              <button
                type="button"
                onClick={() => handlePlanTypeChange("workout")}
                aria-pressed={planType === "workout"}
                aria-controls="ff-profile-plans"
              >
                <SlEnergy aria-hidden="true" />
                <span>Treino</span>
                <span className="ff-profile-filter-count">
                  {workoutPlans.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handlePlanTypeChange("nutrition")}
                aria-pressed={planType === "nutrition"}
                aria-controls="ff-profile-plans"
              >
                <IoNutritionOutline aria-hidden="true" />
                <span>Nutrição</span>
                <span className="ff-profile-filter-count">
                  {nutritionPlans.length}
                </span>
              </button>
            </div>
            <div id="ff-profile-plans" className="ff-profile-plan-area">
              {planType === "workout" ? (
                <div className="ff-profile-plan-grid">
                  {workoutPlans.length > 0 ? (
                    workoutPlans.map((plan) => (
                      <WorkoutPlanPreview
                        key={plan.id}
                        plan={plan}
                        onDeletePlan={() => openDeleteModal(plan, "workout")}
                      />
                    ))
                  ) : (
                    <div className="ff-profile-empty">
                      <span className="ff-profile-empty-icon">
                        <SlEnergy aria-hidden="true" />
                      </span>
                      <h3>O teu próximo treino começa aqui.</h3>
                      <p>
                        Ainda não tens planos de treino guardados. Cria um plano
                        à tua medida e guarda-o para o encontrares aqui.
                      </p>
                      <Link to="/treinos">
                        Criar o primeiro treino{" "}
                        <FiArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : planType === "nutrition" ? (
                <div className="ff-profile-plan-grid ff-profile-nutrition-grid">
                  {nutritionPlans.length > 0 ? (
                    nutritionPlans.map((plan) => (
                      <NutritionPlanPreview
                        key={plan.id}
                        plan={plan}
                        onDeletePlan={() => openDeleteModal(plan, "nutrition")}
                      />
                    ))
                  ) : (
                    <div className="ff-profile-empty">
                      <span className="ff-profile-empty-icon">
                        <IoNutritionOutline aria-hidden="true" />
                      </span>
                      <h3>Dá espaço a uma nova rotina.</h3>
                      <p>
                        Ainda não tens planos de alimentação guardados. Conversa
                        com o assistente e guarda o teu primeiro plano.
                      </p>
                      <Link to="/nutricao">
                        Criar o primeiro plano alimentar{" "}
                        <FiArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </section>
          <aside
            className="ff-profile-sidebar"
            aria-labelledby="ff-profile-shortcuts-title"
          >
            <p className="ff-help-eyebrow">À distância de um passo</p>
            <h2 id="ff-profile-shortcuts-title">A tua próxima sessão.</h2>
            <p>Escolhe por onde queres continuar.</p>
            <Link to="/treinos">
              <span className="ff-profile-shortcut-icon">
                <SlEnergy aria-hidden="true" />
              </span>
              <span>
                <strong>Criar treino</strong>
                <small>Define o teu foco e intensidade.</small>
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/nutricao">
              <span className="ff-profile-shortcut-icon">
                <IoNutritionOutline aria-hidden="true" />
              </span>
              <span>
                <strong>Planear a alimentação</strong>
                <small>Encontra o teu equilíbrio.</small>
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
            <div className="ff-profile-help">
              <FiHelpCircle aria-hidden="true" />
              <h3>Precisas de orientação?</h3>
              <p>Encontra respostas sobre os teus planos e a tua conta.</p>
              <Link to="/faq">
                Perguntas frequentes <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        defaultAvatar={defaultAvatar}
        newAvatar={user.avatarUrl || null}
        submitText={submitText}
        saveChanges={updateProfile}
      />
      {showSuccessWarning && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
      {deleteModalOpen && planToDelete && (
        <DeleteModal
          itemToDelete={planToDelete}
          closeDeleteModal={closeDeleteModal}
          handleDeleteItem={confirmDeletePlan}
          title="Eliminar Plano"
          message={`Tem a certeza que deseja eliminar este plano de ${planToDelete.type === "workout" ? "treino" : "alimentação"}?`}
          isDeleting={isDeletingPlan === planToDelete.id}
        />
      )}
    </div>
  );
}
export default Profile;
