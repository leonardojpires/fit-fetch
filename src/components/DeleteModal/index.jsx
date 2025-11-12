function DeleteModal({ itemToDelete, closeDeleteModal, handleDeleteItem, title, message }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={closeDeleteModal}
    >
      <div
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md !p-6 border border-gray-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-xl !mb-6 text-red-600">
          { title }
        </h2>

        <div className="!mb-6">
          <p className="font-body text-gray-700 !mb-4">
            { message }
          </p>
          <div className="bg-gray-50 !p-4 rounded-lg border border-gray-200">
            <div className="font-body font-medium text-gray-900">
              {itemToDelete.name}
            </div>
            <div className="font-body text-sm text-gray-600">
              {itemToDelete.email}
            </div>
            <div className="font-body text-xs text-gray-500 !mt-1">
              ID: {itemToDelete.id}
            </div>
          </div>
          <p className="font-body text-sm text-red-600 !mt-4">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="!px-4 !py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-body font-medium text-gray-700 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeleteItem}
            className="!px-4 !py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-body font-medium cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
