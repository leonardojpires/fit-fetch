import "./index.css";
import { useState } from "react";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import { motion } from "framer-motion";
import { IoMdSend } from "react-icons/io";
import { IoBookmarksOutline } from "react-icons/io5";

function Nutrition() {
  useRedirectIfNotAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o teu assistente de nutrição. Descreve os teus objetivos e preferências alimentares para criar um plano personalizado.",
      timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Plano hardcoded para demonstração (será gerado pela IA)
  const nutritionPlan = messages.find(msg => msg.plan)?.plan || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Adiciona mensagem do user
    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    // Simula resposta da IA (será substituído pela chamada real à API)
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant",
        content: "Criei um plano equilibrado baseado nos teus objetivos.",
        timestamp: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
        plan: {
          id: 1,
          plan_name: "Plano de Bulking - Ganho de Massa",
          description: "Plano rico em proteínas e calorias controladas para promover o ganho de massa muscular.",
          total_calories: 2800,
          total_protein: 180,
          total_carbs: 320,
          total_fat: 75,
          meals: [
            {
              meal_type: "Pequeno-Almoço",
              foods: [
                { name: "Ovos Mexidos", quantity: 150, calories: 220, protein: 18, carbs: 2, fat: 15 },
                { name: "Aveia", quantity: 80, calories: 310, protein: 10, carbs: 54, fat: 6 },
                { name: "Banana", quantity: 120, calories: 105, protein: 1, carbs: 27, fat: 0.4 },
              ],
            },
            {
              meal_type: "Almoço",
              foods: [
                { name: "Peito de Frango Grelhado", quantity: 200, calories: 330, protein: 62, carbs: 0, fat: 7 },
                { name: "Arroz Branco", quantity: 150, calories: 195, protein: 4, carbs: 43, fat: 0.3 },
                { name: "Brócolos Cozidos", quantity: 100, calories: 35, protein: 2.8, carbs: 7, fat: 0.4 },
              ],
            },
            {
              meal_type: "Lanche da Tarde",
              foods: [
                { name: "Iogurte Grego Natural", quantity: 200, calories: 130, protein: 20, carbs: 9, fat: 0.7 },
                { name: "Amendoins", quantity: 30, calories: 170, protein: 7, carbs: 5, fat: 14 },
              ],
            },
            {
              meal_type: "Jantar",
              foods: [
                { name: "Salmão Grelhado", quantity: 180, calories: 370, protein: 40, carbs: 0, fat: 22 },
                { name: "Batata Doce", quantity: 200, calories: 180, protein: 2, carbs: 41, fat: 0.3 },
                { name: "Salada Mista", quantity: 150, calories: 50, protein: 2, carbs: 10, fat: 0.5 },
              ],
            },
            {
              meal_type: "Ceia",
              foods: [{ name: "Queijo Cottage", quantity: 150, calories: 165, protein: 25, carbs: 6, fat: 4.5 }],
            },
          ],
        },
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 2000);
  };

  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      console.log("Guardar plano:", nutritionPlan.id);
      // Lógica de guardar
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Erro ao guardar plano:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.section
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="section !mt-40 !py-10">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-black !mb-3">
            Cria o Teu Plano Alimentar Personalizado
          </h1>
          <p className="font-body font-medium text-lg md:text-xl text-black/70 !mb-8">
            Descreve os teus objetivos e preferências para um plano nutricional ideal!
          </p>

          <div className="flex flex-col items-start lg:flex-row !gap-6 !mt-4">
            {/* Chatbot Section */}
            <div className="lg:w-1/2 w-full bg-gray-100 !p-6 rounded-lg shadow-sm flex flex-col" style={{ height: '600px' }}>
              <h2 className="font-headline font-bold text-2xl text-[var(--primary)] !mb-2">
                Assistente de Nutrição
              </h2>
              <p className="font-body text-gray-600 !mb-4 text-sm">
                Conversa com o assistente para criar o teu plano ideal
              </p>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto !mb-4 bg-white rounded-lg !p-4 !space-y-3">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex !gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--secondary)] to-green-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                      <div className={`!px-3 !py-2 rounded-lg text-sm font-body ${
                        msg.role === 'user' 
                          ? 'bg-[var(--primary)] text-white rounded-br-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-400 !mt-1 block">{msg.timestamp}</span>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">👤</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex !gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--secondary)] to-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="max-w-[75%]">
                      <div className="!px-3 !py-2 rounded-lg bg-gray-100 rounded-bl-sm flex !gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex !gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Descreve os teus objetivos..."
                  disabled={loading}
                  className="flex-1 !px-3 !py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all font-body text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="!px-4 !py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Enviar mensagem"
                >
                  <IoMdSend aria-hidden="true" focusable="false" />
                </button>
              </form>
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/2 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg !p-6 flex items-start justify-center">
              {loading ? (
                <div className="flex flex-col items-center !gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary)]"></div>
                  <p className="font-body text-gray-600 text-center text-base md:text-lg">
                    A gerar o plano alimentar...
                  </p>
                </div>
              ) : nutritionPlan ? (
                <div className="w-full">
                  {/* Plan Header */}
                  <div className="!mb-5 !pb-4 border-b border-gray-200">
                    <h3 className="font-headline font-bold text-2xl text-[var(--secondary)] !mb-2">
                      {nutritionPlan.plan_name}
                    </h3>
                    <p className="font-body text-gray-600 text-sm">
                      {nutritionPlan.description}
                    </p>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 !gap-3 !mb-5">
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">{nutritionPlan.total_calories}</div>
                      <div className="text-xs text-gray-500 font-body">Calorias</div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">{nutritionPlan.total_protein}g</div>
                      <div className="text-xs text-gray-500 font-body">Proteína</div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">{nutritionPlan.total_carbs}g</div>
                      <div className="text-xs text-gray-500 font-body">Carbs</div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">{nutritionPlan.total_fat}g</div>
                      <div className="text-xs text-gray-500 font-body">Gordura</div>
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="!space-y-3 !mb-5">
                    {nutritionPlan.meals.map((meal, idx) => (
                      <div key={idx} className="bg-white !p-4 rounded-lg shadow-sm border-l-4 border-[var(--accent)]">
                        <h4 className="font-headline font-semibold text-base text-[var(--primary)] !mb-2">
                          {meal.meal_type}
                        </h4>
                        <div className="!space-y-2 font-body text-sm">
                          {meal.foods.map((food, foodIdx) => (
                            <div key={foodIdx} className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{food.name}</div>
                                <div className="text-xs text-gray-500">
                                  {food.calories} kcal · P: {food.protein}g · C: {food.carbs}g · G: {food.fat}g
                                </div>
                              </div>
                              <span className="text-xs bg-[var(--accent)] text-white !px-2 !py-1 rounded-full !ml-2">
                                {food.quantity}g
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={handleSavePlan}
                      disabled={isSaving}
                      className="flex flex-center items-center !gap-2 font-body text-[var(--primary)] border border-[var(--primary))] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--primary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          A processar...
                        </>
                      ) : (
                        <>
                          <IoBookmarksOutline aria-hidden="true" focusable="false" /> {isSaved ? "Plano Guardado" : "Guardar Plano"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-gray-400 text-center text-base md:text-lg">
                  O plano alimentar vai aparecer aqui
                </p>
              )}
            </div>
          </div>
          <div className="!mt-12" />
        </div>
      </motion.section>
    </>
  );
}

export default Nutrition;
