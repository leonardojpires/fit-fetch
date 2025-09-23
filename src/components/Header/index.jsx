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
        <header className="flex justify-between items-center py-4 px-10 lg:justify-evenly">

            <div>
                <Link to="/">
                    <span className="text-3xl font-bold">
                        <img src="/img/logos/ff_logo.svg" alt="Fit Fetch" width="200px" className="select-none pointer-none" />
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
