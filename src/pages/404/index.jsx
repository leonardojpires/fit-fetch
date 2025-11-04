import './index.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

function NotFound() {
    return (
        <section className="section-lg min-h-screen">
            <div className="flex flex-col justify-center items-center rounded-xl">
                <span className="text-3xl lg:text-6xl text-[var(--primary)]/70 font-bold font-body !mb-3">404</span>
                <h1 className="text-5xl lg:text-[5rem] text-center font-headline !mb-5">Página não encontrada</h1>
                <p className="text-2xl text-black/70 text-center font-body !mb-5">O Fit Fetch não fica neste caminho...</p>
                <Link to='/' className="bg-[var(--primary)] !px-8 !py-3 text-white font-body hover:bg-[var(--accent)] trasition-all ease-in-out duration-200 rounded-xl flex flex-row items-center gap-2"><FaArrowLeft /> Voltar</Link>
            </div>
        </section>
    )
}

export default NotFound;
