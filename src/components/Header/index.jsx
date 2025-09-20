import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

function Header() {
    return (
        <nav className="flex justify-evenly items-center py-4">
            <div>
                <Link to="/">
                    <span className="text-3xl font-bold">
                        <img src="/img/logos/ff_logo.svg" alt="Fit Fetch" width="200px" />
                    </span>
                </Link>
            </div>
            <div className="flex flex-row justify-center items-center gap-10">
                <Link to="/" className="font-headline nav-link underline-hover">HOME</Link>
                <Link to="/treinos" className="font-headline nav-link underline-hover">TREINOS</Link>
                <Link to="/nutricao" className="font-headline nav-link underline-hover">NUTRIÇÃO</Link>
                <Link to="/contacto" className="font-headline nav-link underline-hover">CONTACTO</Link>
            </div>
            <div>
                <a href="" class="font-headline auth-button">
                    ENTRAR
                    <CiLogin />
                </a>
            </div>
        </nav>
    )
}

export default Header;
