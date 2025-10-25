import "./index.css";
import { Link, useLocation } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Header() {
  const [ loading, setLoading ] = useState(true);
  const [ user, setUser ] = useState(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

return (
  <header className={`header w-full flex items-center justify-between px-4 lg:px-8 py-5 ${isHome ? 'bg-black/30' : 'bg-black/80'}`}>
    <div>
      <Link to="/">
        <img
          src="/img/logos/ff_logo.svg"
          alt="Fit Fetch"
          className="select-none pointer-none w-[150px] lg:w-[150px]"
        />
      </Link>
    </div>

    <nav
      className={`nav ${showMenu ? "flex flex-col responsive-nav" : ""}`}
      onClick={toggleMenu}
    >
      <Link to="/" className="font-headline nav-link underline-hover">
        INÍCIO
      </Link>
      <Link to="/treinos" className="font-headline nav-link underline-hover">
        TREINOS
      </Link>
      <Link to="/nutricao" className="font-headline nav-link underline-hover">
        NUTRIÇÃO
      </Link>
      <Link to="/contacto" className="font-headline nav-link underline-hover">
        CONTACTO
      </Link>

      {/* MOBILE BUTTON */}
      {user ? (
        <button
          onClick={handleLogout}
          className="font-headline logout-button-mobile flex flex-row lg:hidden mt-4"
        >
            SAIR <CiLogin />
        </button>
      ) : (
        <Link
          to="/entrar"
          className="font-headline auth-button-mobile flex lg:hidden mt-4"
        >
          ENTRAR <CiLogin />
        </Link>
      )}
    </nav>

    {/* DESKTOP BUTTON */}
    <div className="hidden lg:flex">
      {user ? (
        <button onClick={handleLogout} className="font-headline logout-button">
          {loading ? "..." : "SAIR"} <CiLogin />
        </button>
      ) : (
        <Link to="/entrar" className="font-headline auth-button">
          {loading ? "..." : "ENTRAR"} <CiLogin />
        </Link>
      )}
    </div>

    <div className="menu-button lg:hidden" onClick={toggleMenu}>
      <GiHamburgerMenu />
    </div>
  </header>
);
}

export default Header;
