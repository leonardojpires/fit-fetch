import "./index.css";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaEnvelope, FaCamera } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { useState } from "react";

function EditProfileModal({
  isOpen,
  onClose,
  user,
  defaultAvatar,
  submitText,
  saveChanges,
}) {
  const [avatarFile, setAvatarFile] = useState(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files?.[0] || null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h2 className="font-headline font-bold text-2xl">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Fechar modal"
          >
            <IoMdClose />
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {/* FORM FIELDS */}
          <form
            onSubmit={(e) => saveChanges(e, avatarFile)}
            className="form-container"
          >
            {/* AVATAR SECTION */}
            <div className="avatar-section">
              <div className="avatar-wrapper group">
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : user?.avatarUrl
                      ? user.avatarUrl.startsWith("http")
                        ? user.avatarUrl
                        : `http://localhost:3000${user.avatarUrl}`
                      : defaultAvatar
                  }
                  alt={`Avatar de ${user?.name || 'utilizador'}`}
                  className="avatar-image"
                  width="120"
                  height="120"
                />
                <label htmlFor="avatar" className="avatar-overlay">
                  <FaCamera />
                  <span className="font-body">Alterar Foto</span>
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            {/* NAME FIELD */}
            <div className="form-group">
              <label htmlFor="name" className="form-label font-body">
                <FaUser />
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name}
                placeholder="O teu nome"
                className="form-input font-body"
              />
            </div>

            {/* EMAIL FIELD */}
            <div className="form-group">
              <label htmlFor="email" className="form-label font-body">
                <FaEnvelope />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user?.email}
                placeholder="O teu email"
                className="form-input font-body"
                disabled
              />
              <span className="form-hint font-body">
                O email não pode ser alterado
              </span>
            </div>
            {/* FOOTER */}
            <div className="modal-footer">
              <button onClick={onClose} className="button-secondary font-body">
                Cancelar
              </button>
              <button type="submit" className="button-primary font-body">
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
