import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 !py-12 !px-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 !pb-8">

          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold text-white">Fit Fetch</h3>
            <p className="text-sm text-slate-400">
              A tua plataforma completa para fitness e bem-estar. Transforma o teu corpo e mente.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>


          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Treinos
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Nutrição
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Planos
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <Link to="/contacto" className="text-slate-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contato@fitfetch.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(+351) 938 604 654</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 !pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Fit Fetch. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
