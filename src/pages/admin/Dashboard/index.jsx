import useAdminRedirect from "./../../../hooks/useAdminRedirect.jsx";
import useRedirectIfNotAuth from "./../../../hooks/useIfNotAuth.jsx";
import AdminSidebar from "../../../components/AdminSidebar";
import "../index.css";
import useGetAllUsers from "../../../hooks/Users/useGetAllUsers.jsx";

function Dashboard() {
  useAdminRedirect();
  const { users } = useGetAllUsers();

  const { loading } = useRedirectIfNotAuth();
  if (loading) return null;

  const dashboardData = [
    {
      titulo: "Total de Utilizadores",
      valor: users.length,
      descricao: "Utilizadores registados",
    },
    {
      titulo: "Exercícios",
      valor: 1,
      descricao: "Exercícios cadastrados",
    },
    {
      titulo: "Alimentos",
      valor: 0,
      descricao: "Alimentos cadastrados",
    },
  ];

  return (
    <section className="section-admin admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <h1 className="admin-title font-headline">
          Dashboard Fit Fetch
        </h1>
        <p className="admin-description font-body">
          Bem-vindo(a) ao painel de administração
        </p>
        <div className="grid grid-cols-3 grid-rows-1 gap-10">
            { dashboardData.map((item, index) => (
                <div key={index} className="bg-[var(--background)] !p-6 rounded-lg shadow-md font-body hover:translate-y-[-5px] transition-transform">
                    <div>
                        <h2 className="text-lg font-medium !mb-1">{item.titulo}</h2>
                    </div>
                    <span className="text-2xl text-[var(--primary)] font-bold !mb-2">{item.valor}</span>
                    <p className="text-[0.8rem] text-black/70">{item.descricao}</p>
                </div>
            )) }
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
