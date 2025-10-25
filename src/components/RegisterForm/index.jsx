import { useState } from "react";
import { auth } from "../../services/firebase.js"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import Toast from './../Toast/index';

function RegisterForm({ clickEvent }) {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ name, setName ] = useState(''); 
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [ toastType, setToastType ] = useState('');
    const [ toastMessage, setToastMessage] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;;
    
    const handleRegister = async (e) => {
      e.preventDefault();

      if (password != confirmPassword) {
        setToastMessage("As senhas não coincidem!");
        setToastType(true);
        setShowToast(true);
        return;
      }

      if (!emailRegex.test(email)) {
        setToastMessage("O formato do e-mail é inválido!");
        setToastType(true);
        setShowToast(true);
        return;
      }

      if (!passwordRegex.test(password)) {
        setToastMessage("A password deve conte: 8 ou mais caracteres, pelo menos uma letra maiúscula, uma letra minúscula, um número e um caracter especial!");
        setToastType(true);
        setShowToast(true);
        return; 
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { display: name });

        const idToken = user ? await user.getIdToken(true) : null;

        const res = await fetch('http://localhost:3000/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          }
        });

        const data = await res.json();
        console.log('Utilizador sincronizado no MySQL', data);

        setCurrentUser(data.user);

        console.log("Utilizador criado com sucesso: ", user);
      } catch(e) {
        console.error("Erro ao criar conta:", e);
        alert("Falha ao criar conta:" + e.message);
      }

    }

  return (
    <div className="auth-div w-full lg:w-1/2">
      <h1 className="font-headline text-3xl font-bold !mb-2 text-[var(--secondary)]">
        Cria a tua conta
      </h1>
      <p className="font-body text-black/80 !mb-5">
        Primeira vez aqui? Cria uma conta e junta-te a nós!
      </p>

      <form onSubmit={handleRegister} className="flex flex-col gap-7 font-body">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[0.9rem]">
            Nome
          </label>
          <div className="input-wrapper">
            <FaPerson className="icon" />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="O Teu Nome"
              className="input font-body"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

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

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[0.9rem]">
            Confirmar Senha
          </label>
          <div className="input-wrapper">
            <FaLock className="icon" />
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="*******"
              className="input font-body"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <input
          type="submit"
          value="Criar conta"
          className="submit-input bg-[var(--secondary)] text-body"
        />
      </form>

      <div className="flex flex-row justify-center items-center gap-1.5 font-body !mt-5">
        <p>Já és membro do FitFetch?</p>
        <button
          onClick={clickEvent}
          className="font-semibold cursor-pointer hover:text-[var(--accent)]"
        >
          Entra aqui
        </button>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          isError={toastType}
        />
      )}
    </div>
  );
}

export default RegisterForm;
