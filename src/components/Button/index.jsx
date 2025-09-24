import './index.css';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Button({ text, to, isSecondary }) {

    return (
        <>
            <Link to={ to } className={`fontbody ${ isSecondary ? 'sec-button' : 'button' }`}>
                { text }
            </Link>
        </>
    )
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    to: PropTypes.string,
    isSecondary: PropTypes.bool
}

export default Button;

