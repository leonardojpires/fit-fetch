import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";

function Workout() {
    useRedirectIfNotAuth();

    return (
        <h1>Treino</h1>
    )
}

export default Workout;
