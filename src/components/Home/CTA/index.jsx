import './index.css';
import { IoPersonAddOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function CTA() {
    return (
        <section className="section rounded-2xl !mt-10 !mb-20 !shadow-2xl !px-0">
                <div className="w-full cta-background rounded-2xl">
                    <div className="cta-div">
                        <span className="cta-span font-body">Começa uma nova vida</span>
                        <h2 className="cta-title font-heading">Inscreve-te agora no Fit Fetch e começa uma nova vida</h2>
                        <p className="cta-paragraph font-body">Orgulha-te do teu progresso, não importa o quão pequeno seja. Faz de ti o teu melhor projeto</p>
                        <div className="flex flex-row justify-center items-center gap-5 !mt-5">
                            <Link to="/entrar" className="cta-button font-body">
                                INSCREVE-TE AGORA
                                <IoPersonAddOutline />
                            </Link>
                        </div>
                    </div>
                </div>
        </section>
    )
}

export default CTA;
