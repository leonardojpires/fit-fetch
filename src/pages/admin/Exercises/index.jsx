import "../index.css";
import { auth } from "../../../services/firebase";
import AdminSidebar from "../../../components/AdminSidebar/index";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import { CgGym } from "react-icons/cg";
import useAdminRedirect from "../../../hooks/useAdminRedirect";
import useGetAllUsers from "../../../hooks/Users/useGetAllUsers";
import useAddUser from "../../../hooks/Users/useAddUser";
import useUpdateUser from '../../../hooks/Users/useUpdateUser';
import useDeleteUser from "../../../hooks/Users/useDeleteUser";
import DeleteModal from './../../../components/DeleteModal/index';

function ExercisesPage() {
  useAdminRedirect();

  const { users, setUsers } = useGetAllUsers();
  const { exercises, setExercises } = useGetAllExcercises();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); 
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

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

    const newUser = await addUser(formData);

    if (newUser) {
      const updatedUsers = await fetch("http://localhost:3000/api/users/all", {
        headers: {
          Authorization: `Bearer ${await await auth.currentUser.getIdToken()}`,
        },
      }).then((res) => res.json());
      setUsers(updatedUsers);
    }
    closeModal();
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!userToEdit) return;

    const updatedUser = await updateUser(userToEdit.id, formData);
    if (updatedUser) {
      setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
    }

    closeModal();
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;

    const result = await deleteUser(userToDelete.id);
    if (result) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      closeDeleteModal();
    }
  }

  return (
    <section className="section-admin admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex items-center justify-between !mb-6">
          <div>
            <h1 className="admin-title font-headline">Exercícios</h1>
            <p className="admin-description font-body">
              Gestão de exercícios da plataforma
            </p>
          </div>
          <div className="admin-button font-body" onClick={openAddModal}>
            <button></button>
            <CgGym /> Adicionar Exercício
          </div>
        </div>

        <div className="overflow-auto bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body">
          <table className="w-full min-w-[700px] table-fixed">
            <thead className="text-left bg-white">
              <tr>
                <th className="!p-3">Nome</th>
                <th className="!p-3">Grupo Muscular</th>
                <th className="!p-3">Descrição</th> 
                <th className="!p-3">Séries</th>
                <th className="!p-3">Tempo de Descanso</th>
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
                    Sem exercícios.
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
                      <span className="inline-block !px-3 !py-1 rounded-full bg-[var(--primary)]/70 text-sm text-white">
                        {user.role}
                      </span>
                    </td>
                    <td className="!p-3 text-sm text-gray-600">
                      {user.createdAt.split("T")[0]}
                    </td>
                    <td className="!p-3">
                      <div className="flex items-center gap-2">
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

        {/* Modal: Adicionar Utilizador */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md !p-6 border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-headline text-xl !mb-6 text-[var(--primary)]">
                { isEditModalOpen ? "Editar utilizador" : "Adicionar utilizador" }
              </h2>

              <form onSubmit={ isEditModalOpen ? handleEditSubmit : handleSubmit } className="flex flex-col gap-4">
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
                    disabled={userToEdit?.firebase_uid === auth.currentUser?.uid}
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  { userToEdit?.firebase_uid === auth.currentUser?.uid && ( <span className="font-body text-black/70 text-sm">Não podes alterar o teu próprio cargo</span> ) }
                </div>

                <div className="flex justify-end gap-3 !mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="!px-4 !py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-body font-medium text-gray-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="!px-4 !py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--accent)] transition-colors font-body font-medium cursor-pointer"
                  >
                    { isEditModalOpen ? "Guardar" : "Adicionar" }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Eliminar Utilizador */}
        {isDeleteModalOpen && userToDelete && (
          <DeleteModal
            itemToDelete={userToDelete}
            closeDeleteModal={closeDeleteModal}
            handleDeleteItem={handleDeleteUser}
            title="Eliminar Exercício"
            message="Tem a certeza que deseja eliminar o exercício?"
          />
        )}
      </div>
    </section>
  );
}

export default ExercisesPage;
