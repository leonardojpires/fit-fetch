import "../index.css";
import { auth } from "../../../services/firebase";
import AdminSidebar from "../../../components/AdminSidebar/index";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoRestaurant } from "react-icons/io5";
import useAdminRedirect from "../../../hooks/useAdminRedirect";
import DeleteModal from './../../../components/DeleteModal/index';
import useGetAllFoods from "../../../hooks/Foods/useGetAllFoods";
import useAddFood from "../../../hooks/Foods/useAddFood";
import useUpdateFood from "../../../hooks/Foods/useUpdateFood";
import useDeleteFood from "../../../hooks/Foods/useDeleteFood";

function FoodsPage() {
  useAdminRedirect();

  const { foods, setFoods } = useGetAllFoods();
  const addFood = useAddFood();
  const updateFood = useUpdateFood();
  const deleteFood = useDeleteFood();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState(null); 
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    protein: "",
    carbs: "",
    fiber: "",
  });

  function openAddModal() {
    setFormData({ 
      name: "", 
      protein: "", 
      carbs: "", 
      fiber: ""
    });
    setIsModalOpen(true);
  }

  function openEditModal(food) {
    setFoodToEdit(food);
    setFormData({
      name: food.name,
      protein: food.protein,
      carbs: food.carbs,
      fiber: food.fiber,
    });
    setIsEditModalOpen(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setFoodToEdit(null);
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  }

  function openDeleteModal(food) {
    setFoodToDelete(food);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setFoodToDelete(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newFood = await addFood(formData);

    if (newFood) {
      const updatedFoods = await fetch("http://localhost:3000/api/foods/", {
        headers: {
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        },
      }).then((res) => res.json());
      setFoods(updatedFoods);
    }
    closeModal();
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!foodToEdit) return;

    const updatedFood = await updateFood(foodToEdit.id, formData);
    if (updatedFood && updatedFood.food) {
      setFoods((prev) => prev.map((f) => f.id === updatedFood.food.id ? updatedFood.food : f));
    }

    closeModal();
  }

  async function handleDeleteFood() {
    if (!foodToDelete) return;

    const result = await deleteFood(foodToDelete.id);
    if (result) {
      setFoods((prev) => prev.filter((f) => f.id !== foodToDelete.id));
      closeDeleteModal();
    }
  }

  return (
    <section className="section-admin admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex items-center justify-between !mb-6">
          <div>
            <h1 className="admin-title font-headline">Alimentos</h1>
            <p className="admin-description font-body">
              Gestão de alimentos da plataforma
            </p>
          </div>
          <div className="admin-button font-body" onClick={openAddModal}>
            <button></button>
            <IoRestaurant /> Adicionar Alimento
          </div>
        </div>

        <div className="overflow-auto bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body">
          <table className="w-full min-w-[700px] table-fixed">
            <thead className="text-left bg-white">
              <tr>
                <th className="!p-3">Nome</th>
                <th className="!p-3">Proteína (g)</th>
                <th className="!p-3">Carboidratos (g)</th>
                <th className="!p-3">Fibra (g)</th>
                <th className="!p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="!p-6 text-center text-sm text-gray-500"
                  >
                    Sem alimentos.
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr
                    key={food.id}
                    className="border-t border-gray-200/30 last:border-b last:border-gray-200/30 hover:bg-gray-50 transition-colors dark:border-gray-700/30 dark:last:border-gray-700/30"
                  >
                    <td className="!p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</div>
                          <div className="text-xs text-gray-500">
                            ID: {food.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="!p-3 text-sm text-gray-700">{food.protein}g</td>
                    <td className="!p-3 text-sm text-gray-700">{food.carbs}g</td>
                    <td className="!p-3 text-sm text-gray-700">{food.fiber}g</td>
                    <td className="!p-3">
                      <div className="flex items-center gap-2">
                        <button
                          title="Editar"
                          onClick={() => openEditModal(food)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:scale-105 transition-transform cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => openDeleteModal(food)}
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

        {/* Modal: Adicionar/Editar Alimento */}
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
                { isEditModalOpen ? "Editar alimento" : "Adicionar alimento" }
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
                    placeholder="Nome do alimento"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Proteína (gramas)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Carboidratos (gramas)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Fibra (gramas)
                  </label>
                  <input
                    type="number"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
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

        {/* Modal: Eliminar Alimento */}
        {isDeleteModalOpen && foodToDelete && (
          <DeleteModal
            itemToDelete={foodToDelete}
            closeDeleteModal={closeDeleteModal}
            handleDeleteItem={handleDeleteFood}
            title="Eliminar Alimento"
            message="Tem a certeza que deseja eliminar o alimento?"
          />
        )}
      </div>
    </section>
  );
}

export default FoodsPage;
