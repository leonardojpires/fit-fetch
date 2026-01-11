import "../index.css";
import { auth } from "../../../services/firebase";
import AdminSidebar from "./../../../components/AdminSidebar/index";
import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import useAdminRedirect from "./../../../hooks/useAdminRedirect";
import useGetAllUsers from "../../../hooks/Users/useGetAllUsers";
import useAddUser from "../../../hooks/Users/useAddUser";
import useUpdateUser from "./../../../hooks/Users/useUpdateUser";
import useDeleteUser from "./../../../hooks/Users/useDeleteUser";
import SuccessWarning from "../../../components/SuccessWarning";
import SearchBar from './../../../components/SearchBar/index';

function UsersPage() {
  useAdminRedirect();

  const { users, setUsers } = useGetAllUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessWarning, setShowSuccessWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  const [searchItem, setSearchItem] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const headers = [
    { key: "name", label: "Utilizador", width: "1/4" },
    { key: "email", label: "E-Mail", width: "1/4" },
    { key: "role", label: "Cargo", width: "1/6" },
    { key: "created_at", label: "Criado em", width: "1/6" }
  ];

  function openAddModal() {
    setFormData({ name: "", email: "", role: "user" });
    setIsModalOpen(true);
  }

  function openEditModal(user) {
    setUserToEdit(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setUserToEdit(null);
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  }

  function openDeleteModal(user) {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newUser = await addUser(formData);

      if (newUser) {
        const updatedUsers = await fetch("http://localhost:3000/api/users/all", {
          headers: {
            Authorization: `Bearer ${await await auth.currentUser.getIdToken()}`,
          },
        }).then((res) => res.json());
        setUsers(updatedUsers);
        setSuccessMessage("Utilizador adicionado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!userToEdit) return;
    setIsSubmitting(true);

    try {
      const updatedUser = await updateUser(userToEdit.id, formData);
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        setSuccessMessage("Utilizador editado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteUser(userToDelete.id);
      if (result) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setSuccessMessage("Utilizador apagado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  }

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  };

  useEffect(() => {
    if (showSuccessWarning) {
      const timer = setTimeout(() => {
        setShowSuccessWarning(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessWarning]);

  // Sorting users functionallity
  function handleHeaderClick(field) {
    setSort({
      field,
      direction:
        sort.field === field
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  }

  function getSortedUsers(users) {
    if (sort.direction === "asc") {
      return [...users].sort((a, b) =>
        a[sort.field] > b[sort.field] ? 1 : -1
      );
    }
    return [...users].sort((a, b) => (a[sort.field] > b[sort.field] ? -1 : 1));
  }

  return (
    <section className="section-admin admin-dashboard min-h-screen">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between !gap-3 sm:!gap-4 !mb-4 sm:!mb-6">
          <div className="w-full sm:flex-1">
            <h1 className="admin-title font-headline">Utilizadores</h1>
            <p className="admin-description font-body">
              Gestão de utilizadores da plataforma
            </p>
          </div>
          <div className="admin-button font-body w-full sm:w-auto" onClick={openAddModal}>
            <button></button>
            <FiUserPlus /> <span className="hidden sm:inline">Adicionar Utilizador</span><span className="inline sm:hidden">Adicionar</span>
          </div>
        </div>

        <SearchBar 
          placeholder="Digita o nome do utilizador..."
          label="Buscar Utilizador"
          searchItem={searchItem}
          setSearchItem={setSearchItem}
        />

        <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body overflow-hidden">
          <div className="table-scroll-container overflow-x-auto overflow-y-auto">
            <table className="w-full table-fixed min-w-[700px] sm:min-w-full">
              <thead className="text-left bg-white sticky top-0 z-10">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={() => handleHeaderClick(header.key)}
                      className={`!p-3 cursor-pointer hover:bg-gray-50 select-none ${header.width} ${header.key === "email" ? "min-w-[220px]" : ""}`}
                    >
                      <div className="flex items-center !gap-1">
                        {header.label}
                        {sort.field === header.key && (
                          sort.direction === "asc" ? (
                            <FiChevronUp size={16} />
                          ) : (
                            <FiChevronDown size={16}></FiChevronDown>
                          ))}
                      </div>
                    </th>
                  ))}
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
                getSortedUsers(users)
                  .filter((user) => {
                    return searchItem === ""
                      ? true
                      : user.name.toLowerCase().includes(searchItem.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchItem.toLowerCase());
                  })
                  .map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200/30 last:border-b last:border-gray-200/30 hover:bg-gray-50 transition-colors dark:border-gray-700/30 dark:last:border-gray-700/30"
                  >
                    <td className="!p-3">
                      <div className="flex items-center !gap-3">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="!p-3 text-sm text-gray-700 break-words">{user.email}</td>
                    <td className="!p-3 whitespace-nowrap">
                      <span className="inline-block !px-3 !py-1 rounded-full bg-[var(--primary)]/70 text-sm text-white">
                        {user.role}
                      </span>
                    </td>
                    <td className="!p-3 text-sm text-gray-600">
                      {user.createdAt.split("T")[0]}
                    </td>
                    <td className="!p-3">
                      <div className="flex items-center !gap-2">
                        <button
                          title="Editar"
                          onClick={() => openEditModal(user)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:scale-105 transition-transform cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => openDeleteModal(user)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:scale-105 transition-transform cursor-pointer"
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

        {/* Modal: Adicionar Utilizador */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md !p-4 sm:!p-6 border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-headline text-xl !mb-6 text-[var(--primary)]">
                {isEditModalOpen ? "Editar utilizador" : "Adicionar utilizador"}
              </h2>

              <form
                onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit}
                className="flex flex-col !gap-4"
              >
                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do utilizador"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={
                      userToEdit?.firebase_uid === auth.currentUser?.uid
                    }
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {userToEdit?.firebase_uid === auth.currentUser?.uid && (
                    <span className="font-body text-black/70 text-sm">
                      Não podes alterar o teu próprio cargo
                    </span>
                  )}
                </div>

                <div className="flex justify-end !gap-3 !mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="!px-4 !py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-body font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="!px-4 !py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors font-body font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        A processar...
                      </>
                    ) : (
                      isEditModalOpen ? "Guardar" : "Adicionar"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Eliminar Utilizador */}
        {isDeleteModalOpen && userToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={!isDeleting ? closeDeleteModal : undefined}
          >
            <div
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md !p-4 sm:!p-6 border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-headline text-xl !mb-6 text-red-600">
                Eliminar Utilizador
              </h2>

              <div className="!mb-6">
                <p className="font-body text-gray-700 !mb-4">
                  Tem a certeza que deseja eliminar o utilizador?
                </p>
                <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
                  <div className="font-body font-medium text-gray-900">
                    {userToDelete.name}
                  </div>
                  <div className="font-body text-sm text-gray-600">
                    {userToDelete.email}
                  </div>
                  <div className="font-body text-xs text-gray-500 !mt-1">
                    ID: {userToDelete.id}
                  </div>
                </div>
                <p className="font-body text-sm text-red-600 !mt-4">
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex justify-end !gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="!px-4 !py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-body font-medium text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="!px-4 !py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-body font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      A eliminar...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSuccessWarning && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
    </section>
  );
}

export default UsersPage;
