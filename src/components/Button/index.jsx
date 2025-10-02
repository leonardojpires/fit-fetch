import './index.css';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Button({ text, to, isSecondary, size }) {
    const className = `fontbody ${ isSecondary ? 'sec-button' : 'button' }  ${ size ? 'text-[1.3rem] !px-8 !py-4' : '' }`;

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
    isSecondary: PropTypes.bool,
    size: PropTypes.bool
}

export default Button;

