import useAdminRedirect from "./../../../hooks/useAdminRedirect.jsx";
import useRedirectIfNotAuth from "./../../../hooks/useIfNotAuth.jsx";
import AdminSidebar from "../../../components/AdminSidebar";
import "../index.css";
import useGetAllUsers from "../../../hooks/Users/useGetAllUsers.jsx";
import useGetAllExercises from './../../../hooks/Exercises/useGetAllExercises';
import useGetAllFoods from './../../../hooks/Foods/useGetAllFoods';

function Dashboard() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { loading: adminLoading } = useAdminRedirect();
  const { users } = useGetAllUsers();
  const { exercises } = useGetAllExercises();
  const { foods } = useGetAllFoods();

  if (authLoading || adminLoading) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
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
    <section className="section-admin admin-dashboard min-w-full min-h-screen">
      <AdminSidebar />
      <div className="admin-content flex flex-col items-center">
        <div className="w-full max-w-5xl text-center">
          <h1 className="admin-title font-headline">
            Dashboard Fit Fetch
          </h1>
          <p className="admin-description font-body">
            Bem-vindo(a) ao painel de administração
          </p>
        </div>
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center !gap-4 sm:!gap-5 md:!gap-6 lg:!gap-10">
            { dashboardData.map((item, index) => (
                <div key={index} className="w-full bg-[var(--background)] !p-4 sm:!p-5 md:!p-6 rounded-lg shadow-md font-body hover:translate-y-[-5px] transition-transform text-center">
                    <div>
                        <h2 className="text-base sm:text-lg md:text-xl font-medium !mb-2 sm:!mb-3">{item.titulo}</h2>
                    </div>
                    <span className="text-2xl sm:text-3xl md:text-4xl text-[var(--primary)] font-bold !mb-2 sm:!mb-3">{item.valor}</span>
                    <p className="text-sm sm:text-base md:text-lg text-black/70">{item.descricao}</p>
                </div>
            )) }
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
