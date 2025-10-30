
import useRedirectIfNotAuth from './../../hooks/useIfNotAuth';

function Nutrition() {
    useRedirectIfNotAuth();

    return (
        <h1>Nutrição</h1>
    )
}

export default Nutrition;
