import { Link } from "react-router-dom";
import useAdminRedirect from "./../../../hooks/useAdminRedirect.jsx";
import useRedirectIfNotAuth from "./../../../hooks/useIfNotAuth.jsx";
import AdminSidebar from "../../../components/AdminSidebar";
import "../index.css";
import useGetAllUsers from "../../../hooks/Users/useGetAllUsers.jsx";
import useGetAllExercises from "./../../../hooks/Exercises/useGetAllExercises";
import useGetAllFoods from "./../../../hooks/Foods/useGetAllFoods";

function Dashboard() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { loading: adminLoading } = useAdminRedirect();
  const { users } = useGetAllUsers();
  const { exercises } = useGetAllExercises();
  const { foods } = useGetAllFoods();

  if (authLoading || adminLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  const dashboardData = [
    {
      titulo: "Total de Utilizadores",
      valor: users.length,
      descricao: "Utilizadores registados",
    },
    {
      titulo: "Exercícios",
      valor: exercises.length,
      descricao: "Exercícios cadastrados",
    },
    {
      titulo: "Alimentos",
      valor: foods.length,
      descricao: "Alimentos cadastrados",
    },
  ];

  return (
    <section className="section-admin admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <header className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">Administração · Fit Fetch</p>
            <h1 className="admin-title">Visão geral</h1>
            <p className="admin-description">
              Acompanha a plataforma e gere os seus conteúdos num só lugar.
            </p>
          </div>
        </header>
        <div className="admin-stats">
          {dashboardData.map((item, index) => (
            <article className="admin-stat" key={index}>
              <h2>{item.titulo}</h2>
              <strong>{item.valor}</strong>
              <p>{item.descricao}</p>
            </article>
          ))}
        </div>
        <section
          className="admin-quick-section"
          aria-labelledby="admin-manage-title"
        >
          <h2 id="admin-manage-title">Gestão da plataforma</h2>
          <p>Escolhe uma área para consultar e atualizar os registos.</p>
          <div className="admin-quick-grid">
            <Link to="/admin/utilizadores">
              <span className="admin-quick-number">01</span>
              <h3>Utilizadores</h3>
              <p>Consulta as contas e gere os perfis e permissões.</p>
              <span>Gerir utilizadores →</span>
            </Link>
            <Link to="/admin/exercicios">
              <span className="admin-quick-number">02</span>
              <h3>Exercícios</h3>
              <p>Organiza o catálogo de exercícios e as suas demonstrações.</p>
              <span>Gerir exercícios →</span>
            </Link>
            <Link to="/admin/alimentos">
              <span className="admin-quick-number">03</span>
              <h3>Alimentos</h3>
              <p>Atualiza os alimentos, porções e valores nutricionais.</p>
              <span>Gerir alimentos →</span>
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
export default Dashboard;
