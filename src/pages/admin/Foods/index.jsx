import "../index.css";
import { auth } from "../../../services/firebase";
import AdminSidebar from "../../../components/AdminSidebar/index";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { IoRestaurant } from "react-icons/io5";
import useAdminRedirect from "../../../hooks/useAdminRedirect";
import useRedirectIfNotAuth from "../../../hooks/useIfNotAuth";
import DeleteModal from "./../../../components/DeleteModal/index";
import useGetAllFoods from "../../../hooks/Foods/useGetAllFoods";
import useAddFood from "../../../hooks/Foods/useAddFood";
import useUpdateFood from "../../../hooks/Foods/useUpdateFood";
import useDeleteFood from "../../../hooks/Foods/useDeleteFood";
import SuccessWarning from "../../../components/SuccessWarning";
import SearchBar from './../../../components/SearchBar/index';

function FoodsPage() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { loading: adminLoading } = useAdminRedirect();

  const { foods, setFoods } = useGetAllFoods();
  const addFood = useAddFood();
  const updateFood = useUpdateFood();
  const deleteFood = useDeleteFood();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState(null);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessWarning, setShowSuccessWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  const [searchItem, setSearchItem] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    protein: "",
    carbs: "",
    fiber: "",
    fat: "",
    calories: "",
    serving_size: "100",
    unit: "g",
    category: "",
  });

  const headers = [
    { key: "name", label: "Nome", width: "1/6" },
    { key: "protein", label: "Proteína (g)", width: "1/12" },
    { key: "carbs", label: "Carboidratos (g)", width: "1/12" },
    { key: "fiber", label: "Fibra (g)", width: "1/12" },
    { key: "fat", label: "Gordura (g)", width: "1/12" },
    { key: "calories", label: "Calorias (kcal)", width: "1/12" },
    { key: "serving_size", label: "Porção", width: "1/12" },
    { key: "category", label: "Categoria", width: "1/12" },
  ];

  useEffect(() => {
    if (showSuccessWarning) {
      const timer = setTimeout(() => {
        setShowSuccessWarning(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessWarning]);
  

  if (authLoading || adminLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedFoods = getSortedFoods(foods);
  const currentFoods = sortedFoods.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(foods.length / itemsPerPage);

  function openAddModal() {
    setFormData({
      name: "",
      protein: "",
      carbs: "",
      fiber: "",
      fat: "",
      calories: "",
      serving_size: "100",
      unit: "g",
      category: "",
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
      fat: food.fat,
      calories: food.calories,
      serving_size: food.serving_size,
      unit: food.unit,
      category: food.category || "",
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
    setIsSubmitting(true);

    try {
      const newFood = await addFood(formData);

      if (newFood) {
        const updatedFoods = await fetch("http://localhost:3000/api/foods/", {
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }).then((res) => res.json());
        setFoods(updatedFoods);
        setSuccessMessage("Alimento adicionado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!foodToEdit) return;
    setIsSubmitting(true);

    try {
      const updatedFood = await updateFood(foodToEdit.id, formData);
      if (updatedFood && updatedFood.food) {
        setFoods((prev) =>
          prev.map((f) => (f.id === updatedFood.food.id ? updatedFood.food : f))
        );
        setSuccessMessage("Alimento editado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  async function handleDeleteFood() {
    if (!foodToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteFood(foodToDelete.id);
      if (result) {
        setFoods((prev) => prev.filter((f) => f.id !== foodToDelete.id));
        setSuccessMessage("Alimento removido com sucesso!");
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

  function getSortedFoods(foods) {
    return [...foods].sort((a, b) => {
      if (a[sort.field] === b[sort.field]) return 0;

      if (sort.direction === "asc") {
        return a[sort.field] > b[sort.field] ? 1 : -1;
      }

      return a[sort.field] > b[sort.field] ? -1 : 1;
    });
  }

  return (
    <section className="section-admin admin-dashboard min-h-screen">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between !gap-3 sm:!gap-4 !mb-4 sm:!mb-6">
          <div className="w-full sm:flex-1">
            <h1 className="admin-title font-headline">Alimentos</h1>
            <p className="admin-description font-body">
              Gestão de alimentos da plataforma
            </p>
          </div>
          <div className="admin-button font-body w-full sm:w-auto" onClick={openAddModal}>
            <button></button>
            <IoRestaurant /> <span className="hidden sm:inline">Adicionar Alimento</span><span className="inline sm:hidden">Adicionar</span>
          </div>
        </div>

        <SearchBar
          placeholder="Digita o nome do alimento..."
          label="Buscar Alimento"
          searchItem={searchItem}
          setSearchItem={setSearchItem}
        />

        <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body overflow-hidden">
          <div className="table-scroll-container overflow-x-auto overflow-y-auto">
            <table className="w-full table-auto min-w-[1200px] sm:min-w-full">
              <thead className="text-left bg-white sticky top-0 z-10">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header.key}
                      onClick={() => handleHeaderClick(header.key)}
                      scope="col"
                      className={`!px-4 !py-3 cursor-pointer hover:bg-gray-50 select-none w-${header.width} ${header.key === "name" ? "text-left" : "text-center"} whitespace-nowrap`}
                      aria-sort={sort.field === header.key ? sort.direction : "none"}
                    >
                      <div className="flex items-center !gap-1">
                        {header.label}
                        {sort.field === header.key &&
                          (sort.direction === "asc" ? (
                            <FiChevronUp size={16} aria-hidden="true" focusable="false" />
                          ) : (
                            <FiChevronDown size={16} aria-hidden="true" focusable="false" />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="!p-3" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="!p-6 text-center text-sm text-gray-500"
                  >
                    Sem alimentos.
                  </td>
                </tr>
              ) : (
                currentFoods
                  .filter((food) => {
                    return searchItem === ""
                      ? true
                      : food.name
                          .toLowerCase()
                          .includes(searchItem.toLowerCase());
                  })
                  .map((food) => (
                    <tr
                      key={food.id}
                      className="border-t border-gray-200/30 last:border-b last:border-gray-200/30 hover:bg-gray-50 transition-colors dark:border-gray-700/30 dark:last:border-gray-700/30"
                    >
                      <td className="!p-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {food.name.charAt(0).toUpperCase() +
                                food.name.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {food.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.protein}g
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.carbs}g
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.fiber}g
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.fat}g
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.calories} kcal
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.serving_size}
                        {food.unit}
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {food.category ? (
                          <span className="inline-block !px-2 !py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {food.category}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="!p-3">
                        <div className="flex items-center !gap-2">
                          <button
                            type="button"
                            aria-label={`Editar ${food.name}`}
                            onClick={() => openEditModal(food)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <FiEdit2 aria-hidden="true" focusable="false" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Eliminar ${food.name}`}
                            onClick={() => openDeleteModal(food)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <FiTrash2 aria-hidden="true" focusable="false" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between !gap-4 !mt-4 !px-4 !py-3 border-t border-gray-200/50 bg-white/20">
            {/* Page info */}
            <div className="text-sm font-medium text-gray-600 w-full sm:w-auto">
              A mostrar{" "}
              <span className="text-[var(--primary)] font-semibold">
                {indexOfFirstItem + 1}
              </span>{" "}
              -{" "}
              <span className="text-[var(--primary)] font-semibold">
                {Math.min(indexOfLastItem, foods.length)}
              </span>{" "}
              de{" "}
              <span className="text-[var(--primary)] font-semibold">
                {foods.length}
              </span>{" "}
              alimentos
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border-2 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-current transition-all cursor-pointer font-bold"
              >
                ‹
              </button>

              <div className="flex items-center gap-2 !px-3 !py-1 bg-white rounded-lg border-2 border-gray-200">
                <input
                  type="number"
                  name="page"
                  id="page"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-10 text-center font-semibold text-[var(--primary)] focus:outline-none bg-transparent"
                />
                <span className="text-sm text-gray-500">/ {totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border-2 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-current transition-all cursor-pointer font-bold"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Adicionar/Editar Alimento */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto !p-4 sm:!p-6 border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-headline text-xl !mb-6 text-[var(--primary)]">
                {isEditModalOpen ? "Editar alimento" : "Adicionar alimento"}
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

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Gordura (gramas)
                  </label>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
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
                    Calorias (kcal)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3">
                  <div>
                    <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                      Tamanho da Porção
                    </label>
                    <input
                      type="number"
                      name="serving_size"
                      value={formData.serving_size}
                      onChange={handleInputChange}
                      placeholder="100"
                      step="0.1"
                      min="0.1"
                      required
                      className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                      Unidade
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                    >
                      <option value="g">Gramas (g)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="un">Unidade</option>
                      <option value="colher">Colher de sopa</option>
                      <option value="chavena">Chavena</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Categoria (opcional)
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="">Selecionar categoria...</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Peixe">Peixe</option>
                    <option value="Legumes">Legumes</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Grãos">Grãos</option>
                    <option value="Laticínios">Laticínios</option>
                    <option value="Ovos">Ovos</option>
                    <option value="Óleos">Óleos</option>
                    <option value="Comes">Comes</option>
                  </select>
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
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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

        {/* Modal: Eliminar Alimento */}
        {isDeleteModalOpen && foodToDelete && (
          <DeleteModal
            itemToDelete={foodToDelete}
            closeDeleteModal={closeDeleteModal}
            handleDeleteItem={handleDeleteFood}
            isDeleting={isDeleting}
            title="Eliminar Alimento"
            message="Tem a certeza que deseja eliminar o alimento?"
          />
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

export default FoodsPage;
