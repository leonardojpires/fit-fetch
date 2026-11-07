import "./index.css";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronDown,
  FiHelpCircle,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiX,
} from "react-icons/fi";
import { LuDumbbell, LuLeaf } from "react-icons/lu";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import useCurrentUser from "../../hooks/useCurrentUser";

const navigationGroups = [
  {
    id: "questions",
    label: "Questões",
    caption: "Conhece o Fit Fetch",
    links: [
      {
        to: "/como-funciona",
        label: "Como funciona",
        description: "O primeiro passo para a tua nova rotina.",
        icon: FiLayers,
      },
      {
        to: "/faq",
        label: "Perguntas frequentes",
        description: "Respostas simples às tuas dúvidas.",
        icon: FiHelpCircle,
      },
    ],
  },
  {
    id: "plans",
    label: "Planos",
    caption: "Investe no teu bem-estar",
    links: [
      {
        to: "/treinos",
        label: "Treino",
        description: "Dá forma aos teus objetivos.",
        icon: LuDumbbell,
      },
      {
        to: "/nutricao",
        label: "Nutrição",
        description: "Encontra o teu equilíbrio à mesa.",
        icon: LuLeaf,
      },
    ],
  },
];

function HeaderNavigation({ userInfo, userLoading, handleLogout, pathname }) {
  const [openPanel, setOpenPanel] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  const triggerRefs = useRef({});

  const closeNavigation = () => {
    setOpenPanel(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleOutsidePointer = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpenPanel(null);
        setMobileOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      if (openPanel) {
        event.preventDefault();
        triggerRefs.current[openPanel]?.focus();
        setOpenPanel(null);
      } else if (mobileOpen) {
        event.preventDefault();
        mobileTriggerRef.current?.focus();
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openPanel, mobileOpen]);

  // A breakpoint change must not leave focus in a now-hidden mobile menu.
  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 959px)");
    const resetNavigation = () => {
      if (headerRef.current?.contains(document.activeElement)) {
        headerRef.current.querySelector(".ff-brand")?.focus();
      }
      setOpenPanel(null);
      setMobileOpen(false);
    };
    breakpoint.addEventListener("change", resetNavigation);
    return () => breakpoint.removeEventListener("change", resetNavigation);
  }, []);

  const closePanelOnBlur = (event, id) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenPanel((current) => (current === id ? null : current));
    }
  };

  return (
    <header
      ref={headerRef}
      className="ff-header"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          closeNavigation();
      }}
    >
      <a
        className="ff-header-skip"
        href="#main-content"
        onClick={closeNavigation}
      >
        Saltar para o conteúdo
      </a>
      <div className="ff-header-inner">
        <Link
          className="ff-brand"
          to="/"
          aria-label="Fit Fetch — página inicial"
          onClick={closeNavigation}
        >
          <img src="/img/logos/ff_logo.svg" alt="" width="154" height="52" />
          <span className="ff-brand-caption">
            Treino <span aria-hidden="true">·</span> Nutrição{" "}
            <span aria-hidden="true">·</span> Bem-estar
          </span>
        </Link>

        <button
          className="ff-mobile-toggle"
          type="button"
          ref={mobileTriggerRef}
          aria-expanded={mobileOpen}
          aria-controls="ff-primary-navigation"
          aria-label={mobileOpen ? "Fechar navegação" : "Abrir navegação"}
          onClick={() => {
            setMobileOpen((value) => !value);
            setOpenPanel(null);
          }}
        >
          {mobileOpen ? (
            <FiX aria-hidden="true" />
          ) : (
            <FiMenu aria-hidden="true" />
          )}
        </button>

        <nav
          id="ff-primary-navigation"
          className="ff-primary-nav"
          aria-label="Navegação principal"
          data-open={mobileOpen}
        >
          <ul className="ff-nav-list">
            <li>
              <NavLink
                to="/"
                end
                className="ff-nav-link"
                onClick={closeNavigation}
              >
                Início
              </NavLink>
            </li>
            {navigationGroups.map((group) => (
              <li
                className="ff-nav-group"
                key={group.id}
                onBlur={(event) => closePanelOnBlur(event, group.id)}
              >
                <button
                  className="ff-nav-link ff-nav-disclosure"
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[group.id] = node;
                  }}
                  aria-expanded={openPanel === group.id}
                  aria-controls={`ff-panel-${group.id}`}
                  data-active={group.links.some((link) => link.to === pathname)}
                  onClick={() =>
                    setOpenPanel((current) =>
                      current === group.id ? null : group.id,
                    )
                  }
                >
                  {group.label}
                  <FiChevronDown
                    className="ff-nav-chevron"
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`ff-panel-${group.id}`}
                  className="ff-nav-panel"
                  hidden={openPanel !== group.id}
                >
                  <p className="ff-panel-caption">{group.caption}</p>
                  <ul className="ff-panel-links">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.to}>
                          <NavLink
                            to={link.to}
                            className="ff-panel-link"
                            onClick={closeNavigation}
                          >
                            <span
                              className={`ff-nav-icon ${link.to === "/nutricao" ? "ff-nav-icon-green" : ""}`}
                            >
                              <Icon aria-hidden="true" />
                            </span>
                            <span className="ff-panel-text">
                              <span className="ff-panel-title">
                                {link.label}
                              </span>
                              <span className="ff-panel-description">
                                {link.description}
                              </span>
                            </span>
                            <FiArrowRight
                              className="ff-panel-arrow"
                              aria-hidden="true"
                            />
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
            <li>
              <NavLink
                to="/contacto"
                className="ff-nav-link"
                onClick={closeNavigation}
              >
                Contacto
              </NavLink>
            </li>
          </ul>
          <p className="ff-mobile-note">O teu ritmo. Os teus objetivos.</p>
        </nav>

        <div
          className="ff-account"
          onBlur={(event) => closePanelOnBlur(event, "profile")}
        >
          {userInfo ? (
            <>
              <button
                className="ff-profile-trigger"
                type="button"
                ref={(node) => {
                  triggerRefs.current.profile = node;
                }}
                aria-expanded={openPanel === "profile"}
                aria-controls="ff-account-panel"
                aria-label={`Conta de ${userInfo?.name || "utilizador"}`}
                onClick={() => {
                  setOpenPanel((current) =>
                    current === "profile" ? null : "profile",
                  );
                  setMobileOpen(false);
                }}
              >
                <span className="ff-avatar">
                  <img
                    src={
                      userInfo?.avatarUrl
                        ? userInfo.avatarUrl.startsWith("http")
                          ? userInfo.avatarUrl
                          : `http://localhost:3000${userInfo.avatarUrl}`
                        : defaultAvatar
                    }
                    alt=""
                    width="36"
                    height="36"
                  />
                </span>
                <span className="ff-profile-summary">
                  <span className="ff-profile-name">{userInfo?.name}</span>
                  <span className="ff-profile-caption">A minha conta</span>
                </span>
                <FiChevronDown className="ff-nav-chevron" aria-hidden="true" />
              </button>
              <div
                id="ff-account-panel"
                className="ff-nav-panel ff-account-panel"
                hidden={openPanel !== "profile"}
              >
                <div className="ff-account-heading">
                  <span className="ff-panel-caption">A tua área pessoal</span>
                  <span className="ff-account-name">{userInfo?.name}</span>
                </div>
                <ul className="ff-panel-links">
                  <li>
                    <NavLink
                      to="/perfil"
                      className="ff-panel-link"
                      onClick={closeNavigation}
                    >
                      <span className="ff-nav-icon">
                        <FiUser aria-hidden="true" />
                      </span>
                      <span className="ff-panel-text">
                        <span className="ff-panel-title">O meu perfil</span>
                        <span className="ff-panel-description">
                          Gere a tua informação pessoal.
                        </span>
                      </span>
                      <FiArrowRight
                        className="ff-panel-arrow"
                        aria-hidden="true"
                      />
                    </NavLink>
                  </li>
                  {userInfo?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        className="ff-panel-link"
                        onClick={closeNavigation}
                      >
                        <span className="ff-nav-icon">
                          <FiSettings aria-hidden="true" />
                        </span>
                        <span className="ff-panel-title">Administração</span>
                        <FiArrowRight
                          className="ff-panel-arrow"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  )}
                </ul>
                <div className="ff-account-footer">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ff-signout"
                  >
                    <FiLogOut aria-hidden="true" /> Sair da conta
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/entrar" className="ff-signin" onClick={closeNavigation}>
              {userLoading ? "..." : "Entrar"}
              <FiArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  const { user: userInfo, loading: userLoading } = useCurrentUser();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <HeaderNavigation
      key={location.pathname}
      pathname={location.pathname}
      userInfo={userInfo}
      userLoading={userLoading}
      handleLogout={handleLogout}
    />
  );
}
