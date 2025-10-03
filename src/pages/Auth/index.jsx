import './index.css';
import { Link } from 'react-router-dom';

function AuthPage() {
    return (
        <section className="max-lg-[1200px] w-full !mt-40 !mb-40 !px-[5rem] flex flex-row">
            <div className="w-full h-full flex flex-row gap-5">
                
                <div className="login-div w-1/2">
                    <h1 className="font-headline text-3xl font-bold text-[var(--primary)] !mb-2">Entrar</h1>
                    <p className="font-body text-black/80 !mb-5">Acede à tua conta para continuar</p>

                    <form action="" className="flex flex-col gap-7 font-body">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-[0.9rem]">E-Mail</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                                placeholder="teu@email.com"
                                className="form-input font-body"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-[0.9rem]">Senha</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                placeholder="*******"
                                className="form-input font-body"
                            />
                        </div>

                        <input type="submit" value="Entrar" className="font-body font-semibold text-white bg-[var(--primary)] rounded-2xl !py-3 hover:bg-[var(--accent)] hover:scale-[1.02] transition-all ease-in-out duration-200 cursor-pointer"/>

                    </form>
                    
                    <Link to="#" className="text-center !mt-5 text-black/70 hover:text-[var(--accent)]/70 hover:underline">Esqueci-me da minha senha</Link>

                </div>

                <div className="login-div w-1/2">

                </div>

            </div>
        </section>
    )
}

export default AuthPage;
