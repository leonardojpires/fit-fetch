
import useRedirectIfNotAuth from './../../Hooks/useIfNotAuth';

function Nutrition() {
    useRedirectIfNotAuth();

    return (
        <h1>Nutrição</h1>
    )
}

export default Nutrition;
