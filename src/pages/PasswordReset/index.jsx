import "./index.css";
import AuthLayout from "../../components/AuthLayout";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import useRedirectIfAuth from "../../hooks/useAuthHook";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase.js";
import SuccessWarning from "../../components/SuccessWarning/index.jsx";
import ErrorWarning from "../../components/ErrorWarning/index.jsx";

function PasswordReset() {
  const { loading: authLoading } = useRedirectIfAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const closeSuccessWarning = () => {
    setSuccessMessage("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "E-mail de recuperação enviado com sucesso! Verifica a tua caixa de entrada ou spam.",
      );
    } catch (err) {
      // console.error("Firebase error:", err.code, err.message);
      setError("Erro ao enviar o e-mail de recuperação! Tenta novamente!");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-28 !mb-28 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <AuthLayout recovery>
        <div className="ff-auth-form-slot">
          <div className="auth-div ff-reset-card">
            <div className="ff-auth-heading">
              <h1 className="font-headline text-3xl font-bold text-[var(--primary)]">
                Recuperar Palavra-Passe
              </h1>
              <p className="font-body text-black/70">
                Introduz o teu e-mail para receberes um link de redefinição de
                palavra-passe
              </p>
            </div>
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col gap-2 w-full font-body"
            >
              <label htmlFor="email" className="text-[0.9rem]">
                E-Mail
              </label>
              <div className="input-wrapper">
                <FaEnvelope className="icon" aria-hidden="true" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="teu@email.com"
                  className="input font-body"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="submit-input">
                {loading ? "A enviar..." : "Enviar"}
              </button>
            </form>
            {error && (
              <p className="ff-auth-error" role="alert">
                {error}
              </p>
            )}
            <div className="ff-auth-switch">
              <span className="text-black/70 text-md">
                Lembras-te da tua palavra-passe?
              </span>
              <Link
                to="/entrar"
                className="font-bold text-[var(--primary)] hover:text-[var(--accent)] transition-all ease-in-out duration-200"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>

      {error && (
        <ErrorWarning
          validationErrors={error}
          clearErrors={() => setError("")}
        />
      )}

      {successMessage && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
    </>
  );
}

export default PasswordReset;
