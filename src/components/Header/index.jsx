import './index.css';
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Header() {
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const [ showMenu, setShowMenu ] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const handleLogout = async () => {
        await signOut(auth);
    }

    return (
        <header className="header absolute top-0 left-0 w-full flex items-center justify-between z-50 px-4 lg:px-8 py-5">

            <div>
                <Link to="/">
                    <span>
                        <img src="/img/logos/ff_logo.svg" alt="Fit Fetch" className="select-none pointer-none w-[150px] lg:w-[150px]" />
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

                { user ? (
                    <button onClick={handleLogout} class="font-headline auth-button">
                        SAIR
                        <CiLogin />
                    </button>
                ) : (
                    <Link to="/entrar" class="font-headline auth-button">
                        ENTRAR
                        <CiLogin />
                    </Link>
                    )
                }


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
