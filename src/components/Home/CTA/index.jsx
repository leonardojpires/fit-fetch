import './index.css';
import Button from './../../Button/index';
import { IoPersonAddOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function CTA() {
    return (
        <section className="section cta-background rounded-2xl !mb-20 !shadow-2xl">
                <div className="cta-div">
                    <span className="cta-span font-body">Começa uma nova vida</span>
                    <h2 className="cta-title font-heading">Inscreve-te agora no Fit Fetch e começa uma nova vida</h2>
                    <p className="cta-paragraph font-body">Orgulha-te do teu progresso, não importa o quão pequeno seja. Faz de ti o teu melhor projeto</p>
                    <div className="flex flex-row justify-center items-center gap-5 !mt-5">
                        <Link to="/" className="cta-button font-body">
                            INSCREVE-TE AGORA
                            <IoPersonAddOutline />
                        </Link>
                    </div>
                </div>
        </section>
    )
}

export default CTA;
