import './index.css';
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

function Header() {
    const [ showMenu, setShowMenu ] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    return (
        <header className="header absolute top-0 left-0 w-full flex items-center justify-between z-50 px-5 lg:px-20 py-5 bg-transparent">

            <div>
                <Link to="/">
                    <span>
                        <img src="/img/logos/ff_logo.svg" alt="Fit Fetch" className="select-none pointer-none w-[150px] lg:w-[200px]" />
                    </span>
                </Link>
            </div>

            <nav 
                className={`nav ${ showMenu ? 'flex responsive-nav' : '' }`}
                onClick={toggleMenu}
            >
                <Link to="/" className="font-headline nav-link underline-hover">HOME</Link>
                <Link to="/treinos" className="font-headline nav-link underline-hover">TREINOS</Link>
                <Link to="/nutricao" className="font-headline nav-link underline-hover">NUTRIÇÃO</Link>
                <Link to="/contacto" className="font-headline nav-link underline-hover">CONTACTO</Link>

                <a href="" class="font-headline auth-button">
                    ENTRAR
                    <CiLogin />
                </a>
            </nav>

            <div 
                className='menu-button'
                onClick={toggleMenu}                    
            >
                <GiHamburgerMenu />
            </div>

        </header>
    )
}

export default Header;
