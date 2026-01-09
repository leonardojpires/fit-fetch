import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../../services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import ErrorWarning from "../ErrorWarning/index";

function LoginForm({ clickEvent }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ rememberMe, setRememberMe ] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const loginWithGoogle = async () => {
  try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

      await setPersistence(auth, persistence);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Utilizador logado ao Firebase:", {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
      });

      const idToken = user ? await user.getIdToken(true) : null;
      console.log("ID Token:", idToken);

      const res = await fetch("http://localhost:3000/api/users/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      console.log("Utilizador sincronizado no MySQL", data);

      setCurrentUser(data.user);
    } catch (e) {
      console.error(`Erro ao autenticar com a Google: ${e}`);
      setValidationErrors([{
        field: "Google",
        message: "Falha na autenticação. Tenta novamente."
      }]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

      await setPersistence(auth, persistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = user ? await user.getIdToken(true) : null;

      const res = await fetch("http://localhost:3000/api/users/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      console.log("Utilizador sincronizado no MySQL", data);

      setCurrentUser(data.user);
    } catch (e) {
      console.error("Erro ao entrar na conta", e);
      setValidationErrors([{
        field: "Autenticação",
        message: "Falha ao entrar na conta. Verifica credenciais."
      }]);
    }
  };

  return (
    <>
    <div className="auth-div w-full lg:w-1/2">
      <h1 className="font-headline text-3xl font-bold text-[var(--primary)] !mb-2">
        Entrar
      </h1>
      <p className="font-body text-black/80 !mb-5">
        Acede à tua conta para continuar
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-7 font-body">
        <div className="flex flex-col gap-2">
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
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[0.9rem]">
            Senha
          </label>
          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="*******"
              className="input font-body"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 accent-[var(--primary)] rounded-sm"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label
            htmlFor="remember"
            className="font-body text-[0.9rem] text-[var(--text)] cursor-pointer"
          >
            Lembrar-me
          </label>
        </div>

        <input
          type="submit"
          value="Entrar"
          className="submit-input bg-[var(--primary)] font-body"
        />
      </form>

      <span className="text-center !mt-5 !mb-5 text-[var(--text)] font-body pointer-events-none">
        Ou
      </span>

      <div className="flex justify-center cursor-pointer">
        <div className="google-input">
          <FaGoogle className="text-red-500" />
          <button onClick={loginWithGoogle} className="cursor-pointer">
            Entrar com a Google
          </button>
        </div>
      </div>

      <Link
        to="#"
        className="text-center !mt-5 text-black/70 hover:text-[var(--accent)]/70 hover:underline"
      >
        Esqueci-me da minha senha
      </Link>

      <div className="flex flex-row justify-center items-center gap-1.5 font-body !mt-5">
        <p>Ainda não tens uma conta?</p>
        <button
          onClick={clickEvent}
          className="font-semibold cursor-pointer hover:text-[var(--accent)]"
        >
          Inscreve-te já
        </button>
      </div>
    </div>
    {validationErrors.length > 0 && (
      <ErrorWarning
        validationErrors={validationErrors}
        clearErrors={() => setValidationErrors([])}
      />
    )}
    </>
  );
}

export default LoginForm;
