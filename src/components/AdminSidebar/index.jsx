import "./index.css";
import React, { useState } from "react";
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
        className="lg:hidden fixed top-4 left-4 z-50 !p-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-colors"
        onClick={toggleMenu}
        aria-label="Abrir menu de navegação"
        aria-expanded={isOpen}
        type="button"
      >
        {isOpen ? <FiX size={24} aria-hidden="true" focusable="false" /> : <FiMenu size={24} aria-hidden="true" focusable="false" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar font-body ${isOpen ? "open" : ""}`}
        aria-label="Admin sidebar"
      >
        <div>
          <div className="brand">Admin</div>
          <nav>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "admin-nav-link active !text-[var(--primary)] font-medium"
                    : "admin-nav-link"
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
          <FaArrowLeft />
          <span>Voltar</span>
        </NavLink>
      </aside>
    </>
  );
}
