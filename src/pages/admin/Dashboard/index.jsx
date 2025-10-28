import useRedirectIfNotAuth from "../../../Hooks/useIfNotAuth";


function Dashboard() {
    useRedirectIfNotAuth();

    return (
        <div className="mt-40">
            Admin Dashboard
        </div>
    )
}

export default Dashboard;
