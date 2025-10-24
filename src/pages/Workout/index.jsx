import useRedirectIfNotAuth from "../../Hooks/useIfNotAuth";

function Workout() {
    useRedirectIfNotAuth();

    return (
        <h1>Treino</h1>
    )
}

export default Workout;
