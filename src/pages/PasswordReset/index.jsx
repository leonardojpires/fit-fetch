import "./index.css";
import { motion } from "framer-motion";
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
  }
  
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
      console.error("Firebase error:", err.code, err.message);
      setError("Erro ao enviar o e-mail de recuperação! Tenta novamente!");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <section className="loading-section">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <motion.section
        className="w-full !py-40 pb-48"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="section !py-16 flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-8 bg-white !px-10 !py-16 rounded-xl shadow-md w-full max-w-md">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-headline text-3xl font-bold text-[var(--primary)]">
                Recuperar Palavra-Passe
              </h1>
              <p className="font-body text-black/70">
                Introduz o teu e-mail para receberes um link de redefiniçao de
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
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="teu@email.com"
                  className="input font-body"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="bg-[var(--primary)] text-white !py-2 rounded-lg hover:bg-[var(--accent)] transition-all ease-in-out duration-200 cursor-pointer"
              >
                {loading ? "A enviar..." : "Enviar"}
              </button>
            </form>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            <div className="flex flex-row items-center gap-1 text-center font-body">
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
      </motion.section>

      {error && (
        <ErrorWarning
          validationErrors={error}
          clearErrors={() => setError("")}
        />
        )
      }

      {successMessage && (
        <SuccessWarning
          message={successMessage}
          closeWarning={closeSuccessWarning}
        />
      )
    }
    </>
  );
}

export default PasswordReset;
