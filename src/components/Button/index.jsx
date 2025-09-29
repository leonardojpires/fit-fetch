import './index.css';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Button({ text, to, isSecondary }) {
    const className = `fontbody ${ isSecondary ? 'sec-button' : 'button' }`;

    if (to?.startsWith('#')) {
        return (
            <a href={to} className={className}>
                { text }
            </a>
        )
    };

    return (
        <>
            <Link to={ to } className={className}>
                { text }
            </Link>
        </>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    to: PropTypes.string,
    isSecondary: PropTypes.bool
}

export default Button;

