import "./index.css";
import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/utilizadores", label: "Utilizadores" },
  { to: "/admin/planos-treino", label: "Planos Treino" },
  { to: "/admin/planos-alimentacao", label: "Planos Alimentação" },
  { to: "/admin/exercicios", label: "Exercícios" },
  { to: "/admin/alimentos", label: "Alimentos" },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar font-body" aria-label="Admin sidebar">
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
        }}
        className="back-link"
      >
        <FaArrowLeft />
        <span>Voltar</span>
      </NavLink>
    </aside>
  );
}
