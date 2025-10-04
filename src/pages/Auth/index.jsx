import './index.css';
import { Link } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { FaPerson } from "react-icons/fa6";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../services/firebase";

function AuthPage() {
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            console.log("Utilizador logado:", {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL
            });
        } catch(e) {
            console.error(`Erro ao autenticar com a Google: ${e}`);
            alert("Falha na autenticação. Tenta novamente")
        }
    }

    return (
        <section className="max-lg-[1200px] w-full !mt-40 !mb-40 !px-[5rem] flex flex-row">
            <div className="w-full h-full flex flex-col gap-5 lg:flex-row">
                
                {/* LOGIN */}
                <div className="auth-div w-full lg:w-1/2">
                    <h1 className="font-headline text-3xl font-bold text-[var(--primary)] !mb-2">Entrar</h1>
                    <p className="font-body text-black/80 !mb-5">Acede à tua conta para continuar</p>

                    <form action="" className="flex flex-col gap-7 font-body">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[0.9rem]">E-Mail</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="icon" />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="teu@email.com"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-[0.9rem]">Senha</label>
                            <div className="input-wrapper">
                                <FaLock className="icon" />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="*******"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 accent-[var(--primary)] rounded-sm"
                        />
                        <label htmlFor="remember" className="font-body text-[0.9rem] text-[var(--text)] cursor-pointer">
                            Lembrar-me
                        </label>
                        </div>

                        <input type="submit" value="Entrar" className="submit-input bg-[var(--primary)] font-body"/>

                    </form>
                    
                    <span className="text-center !mt-5 !mb-5 text-[var(--text)] font-body pointer-events-none">Ou</span>

                    <div className="flex justify-center cursor-pointer">
                        <div className="w-[50%] flex flex-row justify-center items-center gap-3 bg-[var(--text-secondary)]/30 !px-6 !py-3 hover:shadow-lg">
                            <FaGoogle className="text-red-500"/>
                            <button onClick={loginWithGoogle} className="cursor-pointer">Entrar com a Google</button>
                        </div>
                    </div>

                    <Link to="#" className="text-center !mt-5 text-black/70 hover:text-[var(--accent)]/70 hover:underline">Esqueci-me da minha senha</Link>

                </div>



                {/* REGISTER */}
                <div className="auth-div w-full lg:w-1/2">
                    <h1 className="font-headline text-3xl font-bold !mb-2 text-[var(--secondary)]">Cria a tua conta</h1>
                    <p className="font-body text-black/80 !mb-5">Primeira vez aqui? Cria uma conta e junta-te a nós!</p>

                    <form action="" className="flex flex-col gap-7 font-body">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[0.9rem]">Nome</label>
                            <div className="input-wrapper">
                                <FaPerson className="icon" />
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="O Teu Nome"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[0.9rem]">E-Mail</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="icon" />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="teu@email.com"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-[0.9rem]">Senha</label>
                            <div className="input-wrapper">
                                <FaLock className="icon" />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="*******"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-[0.9rem]">Confirmar Senha</label>
                            <div className="input-wrapper">
                                <FaLock className="icon" />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="*******"
                                    className="input font-body"
                                    required
                                />
                            </div>
                        </div>

                        <input type="submit" value="Criar conta" className="submit-input bg-[var(--secondary)] text-body"/>

                    </form>

                </div>
        </div>

    </section>
    )
}

export default AuthPage;
