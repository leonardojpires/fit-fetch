import "../index.css";
import AdminSidebar from "./../../../components/AdminSidebar/index";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import useAdminRedirect from './../../../hooks/useAdminRedirect';
import useGetAllUsers from "../../../hooks/useGetAllUsers";


function UsersPage() {
  useAdminRedirect();

  const users = useGetAllUsers();

  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ formData, setFormData ] = useState({ name: "", email: "", role: "user" });
  const [ mode, setMode ] = useState("add");

  return (
    <section className="section-admin admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex items-center justify-between !mb-6">
          <div>
            <h1 className="admin-title font-headline">Utilizadores</h1>
            <p className="admin-description font-body">
              Gestão de utilizadores da plataforma
            </p>
          </div>
          <div>
            <button
              className="font-body button flex flex-row items-center gap-2"
            >
              <FiUserPlus /> Adicionar
            </button>
          </div>
        </div>

  <div className="overflow-auto bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body">
          <table className="w-full min-w-[700px] table-fixed">
            <thead className="text-left bg-white">
              <tr>
                <th className="!p-3">Utilizador</th>
                <th className="!p-3">Email</th>
                <th className="!p-3">Role</th>
                <th className="!p-3">Criado em</th>
                <th className="!p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="!p-6 text-center text-sm text-gray-500"
                  >
                    Sem utilizadores
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200/30 last:border-b last:border-gray-200/30 hover:bg-gray-50 transition-colors dark:border-gray-700/30 dark:last:border-gray-700/30"
                  >
                    <td className="!p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="!p-3 text-sm text-gray-700">{user.email}</td>
                    <td className="!p-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="!p-3 text-sm text-gray-600">
                      {user.createdAt}
                    </td>
                    <td className="!p-3">
                      <div className="flex items-center gap-2">
                        <button
                          title="Editar"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:scale-105 transition-transform"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          title="Eliminar"
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:scale-105 transition-transform"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default UsersPage;
