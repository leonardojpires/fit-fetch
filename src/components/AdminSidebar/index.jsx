import "./index.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/utilizadores", label: "Utilizadores" },
  { to: "/admin/exercicios", label: "Exercícios" },
  { to: "/admin/alimentos", label: "Alimentos" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Only */}
      <button
        className="admin-menu-toggle"
        onClick={toggleMenu}
        aria-label={
          isOpen
            ? "Fechar navegação administrativa"
            : "Abrir navegação administrativa"
        }
        aria-controls="admin-navigation"
        aria-expanded={isOpen}
        type="button"
      >
        <span>Administração</span>{" "}
        {isOpen ? (
          <FiX size={24} aria-hidden="true" focusable="false" />
        ) : (
          <FiMenu size={24} aria-hidden="true" focusable="false" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar font-body ${isOpen ? "open" : ""}`}
        id="admin-navigation"
        aria-label="Navegação administrativa"
      >
        <div>
          <div className="brand">
            Fit<span>Fetch</span>
            <small>ÁREA DE ADMINISTRAÇÃO</small>
          </div>
          <nav aria-label="Administração">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "admin-nav-link active" : "admin-nav-link"
                }
                end
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <NavLink
          to=".."
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
            closeMenu();
          }}
          className="back-link"
        >
          <FaArrowLeft aria-hidden="true" />
          <span>Voltar</span>
        </NavLink>
      </aside>
    </>
  );
}
