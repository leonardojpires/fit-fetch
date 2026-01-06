import "./index.css";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaHeadphonesAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const contactData = [
    { id: 1, method: "E-Mail", details: "Pedidos formais e anexos", info: "suporte@fit-fetch.pt", icon: <MdOutlineAlternateEmail size={20} color="#4A90E2" /> },
    { id: 2, method: "Telefone", details: "Linha direta com o suporte", info: "938 604 654", icon: <FaHeadphonesAlt size={20} color="#4A90E2" /> },
];

function Contact() {
    return (
        <section className="!mt-40 contact-page">
            <div className="section !py-16">
                {/* HEADING DIV */}
                <div className="flex flex-col justify-center items-center text-center !mb-12z">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold leading-tight text-black !mt-4 !mb-4">Contacta-nos</h1>
                    <p className="font-body text-black/70 text-xl max-w-2xl mx-auto !mb-6">Precisas de ajuda? Contacta o suporte do Fit Fetch e recebe o melhor apoio possível</p>
                </div>

                {/* CONTACT DIV */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="glass-card"
                >
                    <div className="flex flex-col gap-6 !p-6">
                        {/* CONTACT DATA */}
                        <div className="flex flex-row justify- gap-6 flex-wrap">
                            {contactData.map((contact) => (
                                <div key={contact.id} className="flex flex-1 flex-row justify-start items-center gap-4 bg-gray-100 border-[1px] border-[var(--primary)]/50 rounded-lg !p-2 !pr-6 max-w-sm">
                                    <div className="!text-sm bg-[var(--primary)]/10 rounded-md !p-2 flex items-center justify-center">
                                        {contact.icon}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-md font-headline font-semibold">{contact.method}</h2>
                                        <p className="text-xs font-body text-black/70">{contact.details}</p>
                                        <span className="text-xs text-[var(--primary)] font-bold font-body">{contact.info}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CONTACT FORM */}
                        <div>
                            <form action="">
                                <div className="flex flex-col gap-2 !mb-4">
                                    <label htmlFor="yname">Nome</label>
                                    <input type="text" placeholder="Ex: João" name="yname" id="yname"/>
                                </div>
                               <div className="flex flex-col gap-2 !mb-4">
                                    <label htmlFor="yemail">E-Mail</label>
                                    <input type="email" placeholder="Ex: joao@exemplo.com" name="yemail" id="yemail" />
                                </div>
                                <div className="flex flex-col gap-2 !mb-4">
                                    <label htmlFor="ysubject">Assunto</label>
                                    <select name="ysubject" id="ysubject">
                                        <option disabled>Seleciona uma opção</option>
                                        <option value="workout_plans">Planos de Treino</option>
                                        <option value="nutrition_plans">Planos de Nutrição</option>
                                        <option value="account_authentication">Conta e Autenticação</option>
                                        <option value="suggestion_improvement">Sugestão ou Melhoria</option>
                                        <option value="other">Outro</option>
                                    </select>
                                </div>
                               <div className="flex flex-col gap-2 !mb-4">
                                    <label htmlFor="yphone">Contacto Telefónico (opcional)</label>
                                    <input type="tel" placeholder="Ex: 123 456 789" name="yphone" id="yphone" />
                                </div>
                               <div className="flex flex-col gap-2 !mb-4">
                                    <label htmlFor="ymessage">Mensagem</label>
                                    <textarea placeholder="Escreve aqui a tua mensagem" name="ymessage" id="ymessage"></textarea>
                                </div>
                               <div className="flex flex-row items-center gap-2 !mb-4">
                                    <input type="checkbox" name="yagree" id="yagree" />
                                    <label htmlFor="yagree">Concordo em ser contactado para suporte</label>
                                </div>
                                 <button type="submit" className="bg-[var(--primary)] text-white !py-2 !px-8 cursor-pointer hover:bg-[var(--accent)] rounded-lg hover:scale-[1.02] transition-all ease-in-out duration-200 w-full">Enviar Mensagem</button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact;
