import "./index.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpBreadcrumb, HelpReveal } from "../../components/HelpPages";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiMessageCircle,
  FiAlertCircle,
} from "react-icons/fi";
import SuccessWarning from "../../components/SuccessWarning";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaHeadphonesAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const contactData = [
  {
    id: 1,
    method: "E-Mail",
    details: "Pedidos formais e anexos",
    info: "suporte@fit-fetch.pt",
    icon: <MdOutlineAlternateEmail size={20} color="#4A90E2" />,
  },
  {
    id: 2,
    method: "Telefone",
    details: "Linha direta com o suporte",
    info: "938 604 654",
    icon: <FaHeadphonesAlt size={20} color="#4A90E2" />,
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    yname: "",
    yemail: "",
    ysubject: "",
    yphone: "",
    ymessage: "",
    yagree: false,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.yname,
          from_email: formData.yemail,
          subject: formData.ysubject,
          phone: formData.yphone || "N/A",
          message: formData.ymessage,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setFormData({
        yname: "",
        yemail: "",
        ysubject: "",
        yphone: "",
        ymessage: "",
        yagree: false,
      });
      // eslint-disable-next-line no-unused-vars -- Preserve the existing submission handler.
    } catch (error) {
      // console.error("Erro ao enviar e-mail: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ff-help-page ff-contact-page">
        <header className="ff-help-hero">
          <div className="ff-help-wrap">
            <HelpBreadcrumb current="Contacto" />
            <HelpReveal>
              <div className="ff-contact-hero-grid">
                <div>
                  <p className="ff-help-eyebrow">Vamos conversar</p>
                  <h1>
                    O próximo passo
                    <br />
                    <span>começa com uma conversa.</span>
                  </h1>
                  <p className="ff-help-hero-description">
                    Uma dúvida, uma sugestão ou ajuda com o teu plano? Fala com
                    a equipa Fit Fetch. Estamos aqui para te ajudar.
                  </p>
                </div>
                <div className="ff-contact-hero-note">
                  <span className="ff-contact-hero-icon">
                    <FiMessageCircle aria-hidden="true" />
                  </span>
                  <p>O teu percurso importa.</p>
                  <span>Encontra a melhor forma de falar connosco.</span>
                </div>
              </div>
            </HelpReveal>
          </div>
        </header>

        <div className="ff-help-wrap">
          <div className="ff-contact-layout">
            <HelpReveal>
              <section
                className="ff-contact-form-card"
                aria-labelledby="ff-contact-form-title"
              >
                <div className="ff-contact-form-heading">
                  <span className="ff-help-eyebrow">Entra em contacto</span>
                  <h2 id="ff-contact-form-title">Envia-nos uma mensagem.</h2>
                  <p>
                    Conta-nos em que podemos ajudar. Os campos assinalados com{" "}
                    <span aria-hidden="true">*</span>
                    <span className="ff-contact-sr-only">asterisco</span> são
                    obrigatórios.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  aria-labelledby="ff-contact-form-title"
                  aria-busy={loading}
                >
                  <div className="ff-contact-fields">
                    <div className="ff-contact-field">
                      <label htmlFor="yname">
                        Nome <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="O teu nome"
                        name="yname"
                        id="yname"
                        autoComplete="name"
                        value={formData.yname}
                        onChange={handleChange}
                        aria-describedby="name-hint"
                        required
                      />
                      <small id="name-hint" className="ff-contact-sr-only">
                        Obrigatório
                      </small>
                    </div>
                    <div className="ff-contact-field">
                      <label htmlFor="yemail">
                        E-mail <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="nome@exemplo.com"
                        name="yemail"
                        id="yemail"
                        autoComplete="email"
                        value={formData.yemail}
                        onChange={handleChange}
                        aria-describedby="email-hint"
                        required
                      />
                      <small id="email-hint">
                        O endereço para receberes a nossa resposta.
                      </small>
                    </div>
                    <div className="ff-contact-field">
                      <label htmlFor="ysubject">
                        Assunto <span aria-hidden="true">*</span>
                      </label>
                      <select
                        name="ysubject"
                        id="ysubject"
                        value={formData.ysubject}
                        onChange={handleChange}
                        aria-describedby="subject-hint"
                        required
                      >
                        <option value="" disabled>
                          Seleciona uma opção
                        </option>
                        <option value="workout_plans">Planos de Treino</option>
                        <option value="nutrition_plans">
                          Planos de Nutrição
                        </option>
                        <option value="account_authentication">
                          Conta e Autenticação
                        </option>
                        <option value="suggestion_improvement">
                          Sugestão ou Melhoria
                        </option>
                        <option value="other">Outro</option>
                      </select>
                      <small id="subject-hint">
                        Seleciona o motivo do contacto.
                      </small>
                    </div>
                    <div className="ff-contact-field">
                      <label htmlFor="yphone">
                        Telefone{" "}
                        <span className="ff-contact-optional">(opcional)</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex.: 912 345 678"
                        name="yphone"
                        id="yphone"
                        autoComplete="tel"
                        value={formData.yphone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ff-contact-field ff-contact-field-wide">
                      <label htmlFor="ymessage">
                        Mensagem <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        placeholder="Descreve a tua dúvida ou sugestão…"
                        name="ymessage"
                        id="ymessage"
                        rows={6}
                        value={formData.ymessage}
                        onChange={handleChange}
                        aria-describedby="message-hint"
                        required
                      />
                      <small id="message-hint">
                        Inclui os detalhes que nos ajudem a compreender o teu
                        pedido.
                      </small>
                    </div>
                  </div>
                  <div className="ff-contact-consent">
                    <input
                      type="checkbox"
                      name="yagree"
                      id="yagree"
                      checked={formData.yagree}
                      onChange={handleChange}
                      aria-describedby="agree-hint"
                    />
                    <div>
                      <label htmlFor="yagree">
                        Concordo em ser contactado para suporte.
                      </label>
                      <small id="agree-hint">
                        É necessário concordar para enviar a mensagem.
                      </small>
                    </div>
                  </div>
                  {status === "error" && (
                    <p className="ff-contact-error" role="alert">
                      <FiAlertCircle aria-hidden="true" /> Erro ao enviar
                      mensagem. Tenta novamente.
                    </p>
                  )}
                  <div className="ff-contact-submit-row">
                    <span className="ff-contact-submit-note">
                      O teu feedback ajuda-nos a melhorar.
                    </span>
                    <button
                      type="submit"
                      disabled={loading || !formData.yagree}
                      className="ff-contact-submit"
                    >
                      {loading ? (
                        <>
                          <span
                            className="ff-contact-spinner"
                            aria-hidden="true"
                          />
                          A enviar...
                        </>
                      ) : (
                        <>
                          Enviar mensagem <FiArrowRight aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                  <span className="ff-contact-sr-only" role="status">
                    {loading ? "A enviar mensagem…" : ""}
                  </span>
                </form>
              </section>
            </HelpReveal>
            <HelpReveal>
              <aside
                className="ff-contact-sidebar"
                aria-labelledby="ff-contact-channels-title"
              >
                <p className="ff-help-eyebrow">Ao teu lado</p>
                <h2 id="ff-contact-channels-title">
                  Como preferes
                  <br />
                  falar connosco?
                </h2>
                <p className="ff-contact-sidebar-intro">
                  Usa o formulário ou entra em contacto diretamente por e-mail
                  ou telefone.
                </p>
                <div className="ff-contact-channels">
                  {contactData.map((contact) => (
                    <div className="ff-contact-channel" key={contact.id}>
                      <span
                        className="ff-contact-channel-icon"
                        aria-hidden="true"
                      >
                        {contact.icon}
                      </span>
                      <div>
                        <h3>{contact.method}</h3>
                        <p>{contact.details}</p>
                        <a
                          href={
                            contact.id === 1
                              ? `mailto:${contact.info}`
                              : "tel:+351938604654"
                          }
                        >
                          {contact.info}
                          <FiArrowUpRight aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ff-contact-resources">
                  <span className="ff-help-icon">
                    <FiBookOpen aria-hidden="true" />
                  </span>
                  <h3>A resposta pode estar aqui.</h3>
                  <p>
                    Consulta as perguntas frequentes ou descobre como criar e
                    guardar os teus planos.
                  </p>
                  <Link to="/faq">
                    Perguntas frequentes <FiArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/como-funciona">
                    Como funciona <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </aside>
            </HelpReveal>
          </div>
        </div>
      </div>
      {status === "success" && (
        <SuccessWarning
          message="A mensagem foi enviada com sucesso!"
          closeWarning={() => setStatus("")}
        />
      )}
    </>
  );
}

export default Contact;
