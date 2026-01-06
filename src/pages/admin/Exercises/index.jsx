import "../index.css";
import { auth } from "../../../services/firebase";
import AdminSidebar from "../../../components/AdminSidebar/index";
import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { CgGym } from "react-icons/cg";
import useAdminRedirect from "../../../hooks/useAdminRedirect";
import DeleteModal from "./../../../components/DeleteModal/index";
import SuccessWarning from "../../../components/SuccessWarning";
import useGetAllExercises from "../../../hooks/Exercises/useGetAllExercises";
import useAddExercise from "../../../hooks/Exercises/useAddExercise";
import useUpdateExercise from "../../../hooks/Exercises/useUpdateExercise";
import useDeleteExercise from "../../../hooks/Exercises/useDeleteExercise";
import SearchBar from "./../../../components/SearchBar/index";

function ExercisesPage() {
  useAdminRedirect();

  const { exercises, setExercises } = useGetAllExercises();
  const addExercise = useAddExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
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
    muscle_group: "",
    description: "",
    video_url: "",
    type: "weightlifting",
    difficulty: "beginner",
  });

  const headers = [
    { key: "name", label: "Nome", width: "1/4" },
    { key: "muscle_group", label: "Grupo Muscular", width: "1/4" },
    { key: "type", label: "Tipo", width: "1/6" },
    { key: "difficulty", label: "Dificuldade", width: "1/6" },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExercises = exercises.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(exercises.length / itemsPerPage);

  function openAddModal() {
    setFormData({
      name: "",
      muscle_group: "",
      description: "",
      video_url: "",
      type: "weightlifting",
      difficulty: "beginner",
    });
    setIsModalOpen(true);
  }

  function openEditModal(exercise) {
    setExerciseToEdit(exercise);
    setFormData({
      name: exercise.name,
      muscle_group: exercise.muscle_group,
      description: exercise.description || "",
      video_url: exercise.video_url || "",
      type: exercise.type || "weightlifting",
      difficulty: exercise.difficulty || "beginner",
    });
    setIsEditModalOpen(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setExerciseToEdit(null);
    setIsEditModalOpen(false);
    setIsModalOpen(false);
  }

  function openDeleteModal(exercise) {
    setExerciseToDelete(exercise);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setExerciseToDelete(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSend = { ...formData };

      const newExercise = await addExercise(dataToSend);

      if (newExercise) {
        const updatedExercises = await fetch(
          "http://localhost:3000/api/exercises/all",
          {
            headers: {
              Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
            },
          }
        ).then((res) => res.json());
        setExercises(updatedExercises);
        setSuccessMessage("Exercício adicionado com sucesso!");
        setShowSuccessWarning(true);
      }
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!exerciseToEdit) return;
    setIsSubmitting(true);

    try {
      const dataToSend = { ...formData };

      const updatedExercise = await updateExercise(
        exerciseToEdit.id,
        dataToSend
      );
      if (updatedExercise) {
        setExercises((prev) =>
          prev.map((ex) =>
            ex.id === updatedExercise.id ? updatedExercise : ex
          )
        );
        setSuccessMessage("Exercício atualizado com sucesso!");
        setShowSuccessWarning(true);
      }
    } catch (error) {
        console.error("Erro ao atualizar o exercício:", error);
    } finally {
      setIsSubmitting(false);
      closeModal();
    }

  }

  async function handleDeleteExercise() {
    if (!exerciseToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteExercise(exerciseToDelete.id);
      if (result) {
        setExercises((prev) =>
          prev.filter((ex) => ex.id !== exerciseToDelete.id)
        );
        setSuccessMessage("Exercício removido com sucesso!");
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

  function getSortedExercises(exercises) {
    if (sort.direction === "asc") {
      return [...exercises].sort((a, b) =>
        a[sort.field] > b[sort.field] ? 1 : -1
      );
    }
    return [...exercises].sort((a, b) =>
      a[sort.field] > b[sort.field] ? -1 : 1
    );
  }

  useEffect(() => {
    if (showSuccessWarning) {
      const timer = setTimeout(() => {
        setShowSuccessWarning(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessWarning]);

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

        <SearchBar
          placeholder="Digita o nome do exercício..."
          label="Buscar Exercício"
          searchItem={searchItem}
          setSearchItem={setSearchItem}
        />

        <div className="overflow-auto bg-white/40 backdrop-blur-sm rounded-xl shadow-md font-body">
          <table className="w-full min-w-[700px] table-fixed">
            <thead className="text-left bg-white">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    onClick={() => handleHeaderClick(header.key)}
                    className={`!p-3 cursor-pointer hover:bg-gray-50 select-none w-${header.width}`}
                  >
                    <div className="flex items-center gap-1">
                      {header.label}
                      {sort.field === header.key &&
                        (sort.direction === "asc" ? (
                          <FiChevronUp size={16} />
                        ) : (
                          <FiChevronDown size={16} />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="!p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exercises.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="!p-6 text-center text-sm text-gray-500"
                  >
                    Sem exercícios.
                  </td>
                </tr>
              ) : (
                getSortedExercises(currentExercises)
                  .filter((exercise) => {
                    return searchItem === ""
                      ? true
                      : exercise.name
                          .toLowerCase()
                          .includes(searchItem.toLowerCase());
                  })
                  .map((exercise) => (
                    <tr
                      key={exercise.id}
                      className="border-t border-gray-200/30 last:border-b last:border-gray-200/30 hover:bg-gray-50 transition-colors dark:border-gray-700/30 dark:last:border-gray-700/30"
                    >
                      <td className="!p-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {exercise.name.charAt(0).toUpperCase() +
                                exercise.name.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {exercise.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        {exercise.muscle_group}
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        <span className="inline-flex items-center !px-2 !py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exercise.type || "weightlifting"}
                        </span>
                      </td>
                      <td className="!p-3 text-sm text-gray-700">
                        <span
                          className={`inline-flex items-center !px-2 !py-1 rounded-full text-xs font-medium ${
                            exercise.difficulty === "beginner"
                              ? "bg-green-100 text-green-800"
                              : exercise.difficulty === "intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exercise.difficulty || "beginner"}
                        </span>
                      </td>
                      <td className="!p-3">
                        <div className="flex items-center gap-2">
                          <button
                            title="Editar"
                            onClick={() => openEditModal(exercise)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            title="Eliminar"
                            onClick={() => openDeleteModal(exercise)}
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
          <div className="flex items-center justify-between !mt-4 !px-4 !py-3 border-t border-gray-200/50">
            {/* Page info */}
            <div className="text-sm font-medium text-gray-600">
              A mostrar{" "}
              <span className="text-[var(--primary)] font-semibold">
                {indexOfFirstItem + 1}
              </span>{" "}
              -{" "}
              <span className="text-[var(--primary)] font-semibold">
                {Math.min(indexOfLastItem, exercises.length)}
              </span>{" "}
              de{" "}
              <span className="text-[var(--primary)] font-semibold">
                {exercises.length}
              </span>{" "}
              exercícios
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
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

        {/* Modal: Adicionar/Editar Exercício */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto !p-6 border border-gray-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-headline text-xl !mb-6 text-[var(--primary)]">
                {isEditModalOpen ? "Editar exercício" : "Adicionar exercício"}
              </h2>

              <form
                onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit}
                className="flex flex-col gap-4"
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
                    placeholder="Nome do exercício"
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Grupo Muscular
                  </label>
                  <select
                    name="muscle_group"
                    value={formData.muscle_group}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="">Selecione um grupo</option>
                    <option value="peito">Peito</option>
                    <option value="ombros">Ombros</option>
                    <option value="costas">Costas</option>
                    <option value="pernas">Pernas</option>
                    <option value="bíceps">Bíceps</option>
                    <option value="tríceps">Tríceps</option>
                    <option value="abdominais">Abdominais</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Tipo de Exercício
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="weightlifting">
                      Musculação (Weightlifting)
                    </option>
                    <option value="calisthenics">
                      Calistenia (Calisthenics)
                    </option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Dificuldade
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  >
                    <option value="beginner">Iniciante (Beginner)</option>
                    <option value="intermediate">
                      Intermediário (Intermediate)
                    </option>
                    <option value="advanced">Avançado (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descrição do exercício (opcional)"
                    rows={3}
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium !mb-1.5 text-gray-700">
                    Link do Vídeo
                  </label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full !px-3 !py-2.5 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all font-body"
                  />
                </div>

                <div className="flex justify-end gap-3 !mt-4">
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

        {/* Modal: Eliminar Exercício */}
        {isDeleteModalOpen && exerciseToDelete && (
          <DeleteModal
            itemToDelete={exerciseToDelete}
            closeDeleteModal={closeDeleteModal}
            handleDeleteItem={handleDeleteExercise}
            isDeleting={isDeleting}
            title="Eliminar Exercício"
            message="Tem a certeza que deseja eliminar o exercício?"
          />
        )}
      </div>

      {showSuccessWarning && (
        <SuccessWarning
          message={successMessage}
          onClose={closeSuccessWarning}
        />
      )}
    </section>
  );
}

export default ExercisesPage;
