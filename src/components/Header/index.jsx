import "./index.css";
import { CiLogin } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { IoMdExit, IoIosArrowDown  } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useGetUserInformation from "./../../hooks/useGetUserInformation";

function Header() {
  const userInfo = useGetUserInformation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
    <header className="header relative w-full flex items-center justify-evenly !px-4 !lg:px-6 !py-5 bg-white/10 supports-[backdrop-filter]:backdrop-blur-md dark:bg-black/20">
      {/* LOGO */}
      <div>
        <Link to="/">
          <img
            src="/img/logos/ff_logo.svg"
            alt="Fit Fetch"
            className="select-none pointer-none w-[150px] lg:w-[150px]"
          />
        </Link>
      </div>

      {/* NAVIGATION */}
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
          <div></div>
        ) : (
          <Link
            to="/entrar"
            className="font-headline auth-button-mobile flex lg:hidden mt-4"
          >
            ENTRAR <CiLogin />
          </Link>
        )}
      </nav>

      <div className="flex flex-row justify-center items-center gap-4">
        <div
          className="flex cursor-pointer font-body group"
          onClick={toggleDropdown}
        >
          {user ? (
            <div className="relative flex flex-col items-center gap-3">
              <img
                src={userInfo?.avatarUrl || defaultAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full shadow-md"
              />
              {showDropdown && (
                <div className="absolute top-full !mt-2 w-40 bg-[var(--text-secondary)] dark:bg-[var(--primary)] shadow-lg rounded-md !py-2 flex flex-col z-50">
                  <Link
                    to="/perfil"
                    className="profile-button"
                  >
                    <CgProfile /> Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="profile-button text-left cursor-pointer"
                  >
                    <IoMdExit /> Sair
                  </button>
                </div>
              )}
              <div className="hidden lg:flex flex-row justify-center items-center gap-2 text-sm">
                <span className="flex flex-row items-center gap-2 font-bold text-[var(--primary)] font-body">
                  {userInfo?.name}
                  <IoIosArrowDown className={`${showDropdown ? "rotate-180" : 'group-hover:animate-bounce'}`} />
                </span>
              </div>
            </div>
          ) : (
            <Link to="/entrar" className="font-headline auth-button">
              {loading ? "..." : "ENTRAR"} <CiLogin />
            </Link>
          )}
        </div>
        <div className="menu-button lg:hidden" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
