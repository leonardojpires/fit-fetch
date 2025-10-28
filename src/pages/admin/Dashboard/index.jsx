import useAdminRedirect from './../../../hooks/useAdminRedirect.jsx';
import useRedirectIfNotAuth from './../../../hooks/useIfNotAuth.jsx';

function Dashboard() {
    useAdminRedirect();
    useRedirectIfNotAuth();

    const { loading } = useRedirectIfNotAuth();
    if (loading) return null;

    return (
        <div className="mt-40">
            Admin Dashboard
        </div>
    )
}

export default Dashboard;
