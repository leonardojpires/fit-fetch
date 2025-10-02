import './index.css';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <section className="section-lg min-h-screen">
            <div className="flex flex-col justify-center items-center bg-[var(--primary)]/50 backdrop-blur-3xl !p-4 !py-32 rounded-xl">
                <h1>Página não encontrada</h1>
                <p>O Fit Fetch não fica neste caminho...</p>
                <Link to='/'>Voltar</Link>
            </div>
        </section>
    )
}

export default NotFound;
