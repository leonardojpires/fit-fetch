import { Link } from "react-router-dom";

function Header() {
    return (
        <nav className="flex justify-evenly items-center p-4">
            <div>
                <Link to="/">
                    <span class="text-3xl font-bold">FIT FETCH</span>
                </Link>
            </div>
            <div className="flex flex-row justify-center items-center gap-7">
                <Link to="/" className="font-headline font-medium">HOME</Link>
                <Link to="/treinos" className="font-headline font-medium">PLANOS DE TREINO</Link>
                <Link to="/nutricao" className="font-headline font-medium">NUTRIÇÃO</Link>
                <Link to="/contacto" className="font-headline font-medium">CONTACTO</Link>
            </div>
            <div>
                <a href="">ENTRAR</a>
            </div>
        </nav>
    )
}

export default Header;
