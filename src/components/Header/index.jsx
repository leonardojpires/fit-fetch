import "./index.css";
import { CiLogin } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { GoGear } from "react-icons/go";
import { IoMdExit, IoIosArrowDown } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useCurrentUser from "../../hooks/useCurrentUser";

function Header() {
  const { user: userInfo, setUser, loading: userLoading } = useCurrentUser();

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownClosing, setDropdownClosing] = useState(false);
  const [openNav, setOpenNav] = useState(null);

  const toggleDropdown = () => {
    if (showDropdown) {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  };

  /*   const closeDropdown = () => {
    if (showDropdown) {
      setDropdownClosing(true);
      setTimeout(() => {
        setShowDropdown(false);
        setDropdownClosing(false);
      }, 300);
    }
  }; */

  let isInAdmin = false;

  const location = useLocation();
  if (
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin")
  ) {
    isInAdmin = true;
  }

  /*   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]); */

  const [showMenu, setShowMenu] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const toggleMenu = () => {
    if (showMenu) {
      setShowMenu(false);
    } else {
      setShowMenu(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleDropdownHover = (key) => setOpenNav(key);
  const handleDropdownLeave = () => setOpenNav(false);
  const handleDropdownClick = (e, key) => {
    e.preventDefault();
    setOpenNav((prev) => (prev === key ? false : key));
  };

  return !isInAdmin ? (
    <header className="header relative w-full flex items-center justify-evenly !px-4 !lg:px-6 !py-5 bg-[var(--primary)]/80 backdrop-blur-md">
      {/* LOGO */}
      <div>
        <Link to="/">
          <img
            src="/img/logos/ff_logo.svg"
            alt="Fit Fetch"
            className="logo select-none pointer-none w-[150px] lg:w-[150px]"
          />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav
        className={`nav ${showMenu || menuClosing ? "responsive-nav" : ""} ${
          menuClosing ? "menu-closing" : ""
        }`}
      >
        <Link
          to="/"
          className="font-headline nav-link underline-hover"
          onClick={toggleMenu}
        >
          INÍCIO
        </Link>
        <div
          className="relative w-full flex justify-center items-center"
          onMouseEnter={() => handleDropdownHover("quest")}
          onMouseLeave={handleDropdownLeave}
        >
          <button
            type="button"
            className="font-headline flex gap-1 justify-center items-center nav-link underline-hover cursor-pointer"
            onClick={(e) => handleDropdownClick(e, "quest")}
            aria-expanded={openNav === "quest"}
            aria-haspopup="true"
          >
            QUESTÕES <FaChevronDown />
          </button>
          <AnimatePresence>
            {openNav === "quest" && (
              <motion.div
                key="quest-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full left-[50%] right-0 translate-x-[-50%] min-w-[250px] bg-white/95 backdrop-blur-md shadow-2xl rounded-md !py-2 flex flex-col justify-center items-center z-[200] !p-2 pointer-events-auto cursor-pointer"
              >
                <Link
                  to="/como-funciona"
                  className="sublink"
                  onClick={toggleMenu}
                >
                  COMO FUNCIONA
                </Link>
                <Link to="/faq" className="sublink" onClick={toggleMenu}>
                  FAQ
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="relative w-full flex justify-center items-center"
          onMouseEnter={() => handleDropdownHover("plans")}
          onMouseLeave={handleDropdownLeave}
        >
          <button
            type="button"
            className="font-headline flex gap-1 justify-center items-center nav-link underline-hover cursor-pointer"
            onClick={(e) => handleDropdownClick(e, "plans")}
            aria-expanded={openNav === "plans"}
            aria-haspopup="true"
          >
            PLANOS <FaChevronDown />
          </button>
          <AnimatePresence>
            {openNav === "plans" && (
              <motion.div
                key="plans-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full left-[50%] right-0 translate-x-[-50%] min-w-[250px] bg-white/95 backdrop-blur-md shadow-2xl rounded-md !py-2 flex flex-col justify-center items-center z-[200] !p-2 pointer-events-auto cursor-pointer"
              >
                <Link to="/treinos" className="sublink" onClick={toggleMenu}>
                  TREINO
                </Link>
                <Link to="/nutricao" className="sublink" onClick={toggleMenu}>
                  NUTRIÇÃO
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Link
          to="/contacto"
          className="font-headline nav-link underline-hover"
          onClick={toggleMenu}
        >
          CONTACTO
        </Link>

        {/* MOBILE BUTTON */}
        {userInfo ? (
          <div></div>
        ) : (
          <Link
            to="/entrar"
            className="font-headline auth-button-mobile flex lg:hidden"
            onClick={toggleMenu}
          >
            ENTRAR <CiLogin />
          </Link>
        )}
      </nav>

      {/* USER DROPDOWN */}
      <div className="flex flex-row justify-center items-center gap-4">
        <div
          className="flex cursor-pointer font-body group"
          onClick={toggleDropdown}
        >
          {userInfo ? (
            <div className="relative flex flex-row items-center gap-3">
              <img
                src={
                  userInfo?.avatarUrl
                    ? userInfo.avatarUrl.startsWith("http")
                      ? userInfo.avatarUrl
                      : `http://localhost:3000${userInfo.avatarUrl}`
                    : defaultAvatar
                }
                alt="Avatar"
                className="w-10 h-10 object-cover rounded-full shadow-md pointer-events-none"
              />
              {(showDropdown || dropdownClosing) && (
                <div
                  className={`user-dropdown ${
                    dropdownClosing ? "dropdown-closing" : ""
                  } absolute top-full !mt-2 w-40  bg-[var(--text-secondary)] dark:bg-white  shadow-lg rounded-md !py-2 flex flex-col z-50`}
                >
                  <Link to="/perfil" className="profile-button">
                    <CgProfile /> Perfil
                  </Link>
                  {userInfo?.role === "admin" && (
                    <Link to="/admin" className="profile-button">
                      <GoGear /> Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="profile-button text-left cursor-pointer"
                  >
                    <IoMdExit /> Sair
                  </button>
                </div>
              )}
              <div className="hidden lg:flex flex-row justify-center items-center gap-2 text-sm !font-body">
                <span className="flex flex-row items-center gap-2 font-bold text-[var(--primary)]">
                  {userInfo?.name}
                  <IoIosArrowDown
                    className={`${
                      showDropdown ? "rotate-180" : "group-hover:animate-bounce"
                    }`}
                  />
                </span>
              </div>
            </div>
          ) : (
            <Link to="/entrar" className="font-headline auth-button">
              {userLoading ? "..." : "ENTRAR"} <CiLogin />
            </Link>
          )}
        </div>
        <div className="menu-button lg:hidden" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </div>
      </div>
    </header>
  ) : null;
}

export default Header;
