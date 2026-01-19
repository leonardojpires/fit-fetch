import "./index.css";
import { useState } from "react";
import useRedirectIfNotAuth from "../../hooks/useIfNotAuth";
import useChatNutrition from "../../hooks/Nutrition/useChatNutrition";
import useCreateNutritionPlan from "../../hooks/Nutrition/useCreateNutritionPlan";
import useGetUserNutritionPlans from "../../hooks/Nutrition/useGetUserNutritionPlans";
import useCurrentUser from "./../../hooks/useCurrentUser";
import defaultAvatar from "../../../public/img/avatar/default_avatar.jpg";
import { motion } from "framer-motion";
import { IoMdSend } from "react-icons/io";
import { IoBookmarksOutline } from "react-icons/io5";
import ErrorWarning from "../../components/ErrorWarning";
import SuccessWarning from "../../components/SuccessWarning";

// Simple markdown formatter - converts **text** to bold, etc
const formatMarkdown = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.split("\n").map((line) => {
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return { type: "bullet", text: line.substring(2) };
    } else if (line.startsWith("**") && line.endsWith("**")) {
      return { type: "bold", text: line.substring(2, line.length - 2) };
    }
    return { type: "text", text: line };
  });
};

// Render formatted text as JSX
const renderFormattedText = (text) => {
  if (!text || typeof text !== "string") return text;

  const lines = text.split("\n");
  const result = [];
  let listItems = [];

  lines.forEach((line, idx) => {
    if (!line.trim()) {
      // If we have pending list items, flush them first
      if (listItems.length > 0) {
        result.push(
          <ul key={`list-${result.length}`} className="!ml-4 !space-y-1">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      result.push(<div key={`spacer-${result.length}`} className="h-1" />);
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      // Add to list items buffer
      listItems.push(line.substring(2));
    } else {
      // If we have pending list items, flush them first
      if (listItems.length > 0) {
        result.push(
          <ul key={`list-${result.length}`} className="!ml-4 !space-y-1">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      // Regular paragraph with potential bold formatting
      if (line.includes("**")) {
        const parts = line.split("**");
        result.push(
          <p key={`para-${result.length}`} className="!m-0 !mb-1 text-gray-800">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
            )}
          </p>
        );
      } else {
        result.push(
          <p key={`para-${result.length}`} className="!m-0 !mb-1 text-gray-800">
            {line}
          </p>
        );
      }
    }
  });

  // Flush any remaining list items
  if (listItems.length > 0) {
    result.push(
      <ul key={`list-${result.length}`} className="!ml-4 !space-y-1">
        {listItems.map((item, itemIdx) => (
          <li key={itemIdx} className="text-gray-800">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return result;
};

function Nutrition() {
  const { loading: authLoading } = useRedirectIfNotAuth();
  const { user: userInfo, setUser, loading: userLoading } = useCurrentUser();

  const {
    chatWithAI,
    loading: chatLoading,
    error: chatError,
  } = useChatNutrition();
  const {
    createPlan,
    creating,
    error: createError,
    validationErrors,
    clearErrors,
  } = useCreateNutritionPlan();
  const {
    plans,
    loading: plansLoading,
    error: plansError,
  } = useGetUserNutritionPlans();

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [showSuccessWarning, setShowSuccessWarning] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistente",
      content:
        "Olá! Bem-vindo(a) ao teu assistente de nutrição do Fit Fetch! Estou aqui para ajudar-te a criar um plano alimentar personalizado.\n\nComo posso começar?\n• Qual é o teu objetivo? (perder peso, ganhar massa, manter-me saudável...)\n• Tens alguma restrição dietética?\n• Que tipo de comida gostas?",
      timestamp: new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (authLoading || userLoading) {
    return (
      <section className="w-full">
        <div className="section !mt-40 !mb-40 flex items-center justify-center">
          <p className="font-body text-lg">A carregar...</p>
        </div>
      </section>
    );
  }

  const closeSuccessWarning = () => {
    setShowSuccessWarning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "utilizador",
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage("");
    // Mostrar loading do preview apenas quando o utilizador pede um plano
    const wantsPlan = /\b(plano|gerar|gera|criar|cria)\b/i.test(currentInput);
    setIsGenerating(wantsPlan);

    try {
      const conversationHistory = messages.map((msg) => ({
        role:
          msg.role === "utilizador"
            ? "user"
            : msg.role === "assistente"
              ? "assistant"
              : msg.role,
        content: msg.content,
      }));

      const response = await chatWithAI(currentInput, conversationHistory);

      let messageContent = response.message;
      if (response.plan) {
        messageContent = "Plano gerado! Vê os detalhes ao lado →";
        setNutritionPlan(response.plan);
      }

      const assistantMessage = {
        role: "assistente",
        content: messageContent,
        timestamp: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        role: "assistente",
        content:
          "Ops! 😅 Algo correu mal no meu lado. Podes tentar de novo? Se o problema persistir, avisa-nos!",
        timestamp: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!nutritionPlan) return;
    setIsSaving(true);

    try {
      const lastUserMsg =
        messages.filter((msg) => msg.role === "utilizador").slice(-1)[0]
          ?.content || "";

      const result = await createPlan(nutritionPlan, lastUserMsg);

      console.log("Plano guardado com sucesso: ", result);
      setIsSaved(true);

      const successMessage = {
        role: "assistente",
        content: "O teu plano alimentar foi guardado com sucesso na tua conta!",
        timestamp: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, successMessage]);
      setSuccessModalMessage("O teu plano alimentar foi guardado com sucesso na tua conta!");
      setShowSuccessWarning(true);
    } catch (err) {
      const errorMessage = {
        role: "assistente",
        content:
          "Desculpa, ocorreu um erro ao guardar o teu plano. Por favor, tenta novamente mais tarde.",
        timestamp: new Date().toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
            Descreve os teus objetivos e preferências para um plano nutricional
            ideal!
          </p>

          <div className="flex flex-col items-start lg:flex-row !gap-6 !mt-4">
            {/* Chatbot Section */}
            <div
              className="lg:w-1/2 w-full bg-gray-100 !p-6 rounded-lg shadow-sm flex flex-col"
              style={{ height: "600px" }}
            >
              <h2 className="font-headline font-bold text-2xl text-[var(--primary)] !mb-2">
                Assistente de Nutrição
              </h2>
              <p className="font-body text-gray-600 !mb-4 text-sm">
                Conversa com o assistente para criar o teu plano ideal
              </p>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto !mb-4 bg-white rounded-lg !p-4 !space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex !gap-2 ${
                      msg.role === "utilizador"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.role === "assistente" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--secondary)] to-green-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] ${
                        msg.role === "utilizador" ? "order-1" : ""
                      }`}
                    >
                      <div
                        className={`!px-3 !py-2 rounded-lg text-sm font-body ${
                          msg.role === "utilizador"
                            ? "bg-[var(--primary)] text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.role === "utilizador" ? (
                          msg.content
                        ) : (
                          <div className="space-y-0">
                            {renderFormattedText(msg.content)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 !mt-1 block">
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.role === "utilizador" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-500 flex items-center justify-center flex-shrink-0">
                        <img
                          src={
                            userInfo?.avatarUrl
                              ? userInfo.avatarUrl.startsWith("http")
                                ? userInfo.avatarUrl
                                : `http://localhost:3000${userInfo.avatarUrl}`
                              : defaultAvatar
                          }
                          alt={`Avatar de ${userInfo?.name || "utilizador"}`}
                          className="w-8 h-8 object-cover rounded-full shadow-md pointer-events-none"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex !gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--secondary)] to-green-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="max-w-[75%]">
                      <div className="!px-3 !py-2 rounded-lg bg-gray-100 rounded-bl-sm flex !gap-1">
                        <span
                          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
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
                  disabled={chatLoading}
                  className="flex-1 !px-3 !py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none transition-all font-body text-sm"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !inputMessage.trim()}
                  className="!px-4 !py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Enviar mensagem"
                >
                  <IoMdSend aria-hidden="true" focusable="false" />
                </button>
              </form>
            </div>

            {/* Preview Section */}
            <div className="lg:w-1/2 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg !p-6 flex items-start justify-center">
              {isGenerating && chatLoading ? (
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
                      <div className="text-2xl font-bold text-gray-800">
                        {(
                          nutritionPlan.total_calories || "N/A"
                        ).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        Calorias
                      </div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {(
                          nutritionPlan.total_protein ||
                          nutritionPlan.total_proteins ||
                          "N/A"
                        ).toFixed?.(1) ||
                          nutritionPlan.total_protein ||
                          "N/A"}
                        g
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        Proteína
                      </div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {(nutritionPlan.total_carbs || "N/A").toFixed?.(1) ||
                          nutritionPlan.total_carbs ||
                          "N/A"}
                        g
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        Carbos
                      </div>
                    </div>
                    <div className="bg-white !p-3 rounded-lg shadow-sm text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {(
                          nutritionPlan.total_fat ||
                          nutritionPlan.total_fats ||
                          "N/A"
                        ).toFixed?.(1) ||
                          nutritionPlan.total_fat ||
                          "N/A"}
                        g
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        Gordura
                      </div>
                    </div>
                  </div>

                  {/* Meals */}
                  <div className="!space-y-3 !mb-5">
                    {nutritionPlan.meals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="bg-white !p-4 rounded-lg shadow-sm border-l-4 border-[var(--accent)]"
                      >
                        <h4 className="font-headline font-semibold text-base text-[var(--primary)] !mb-2">
                          {meal.meal_type}
                        </h4>
                        <div className="!space-y-2 font-body text-sm">
                          {meal.foods.map((food, foodIdx) => (
                            <div
                              key={foodIdx}
                              className="flex justify-between items-start"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">
                                  {food.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {food.calories} kcal · P: {food.protein}g · C:{" "}
                                  {food.carbs}g · G: {food.fat}g
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
                      className="flex flex-center items-center !gap-2 font-body text-[var(--primary)] border border-[var(--primary)] rounded-lg !px-4 !py-2 hover:text-white hover:bg-[var(--primary)] transition-all ease-in-out duration-200 !mt-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          A processar...
                        </>
                      ) : (
                        <>
                          <IoBookmarksOutline
                            aria-hidden="true"
                            focusable="false"
                          />{" "}
                          {isSaved ? "Plano Guardado" : "Guardar Plano"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-body text-gray-600 text-center text-base md:text-lg">
                  O plano alimentar vai aparecer aqui
                </p>
              )}
            </div>
          </div>
          <div className="!mt-12" />
        </div>
      </motion.section>

      {/* Warnings */}
      {validationErrors.length > 0 && (
        <ErrorWarning
          validationErrors={validationErrors}
          clearErrors={clearErrors}
        />
      )}

      {validationErrors.length === 0 && showSuccessWarning && (
        <SuccessWarning
          message={successModalMessage}
          closeWarning={closeSuccessWarning}
        />
      )}
    </>
  );
}

export default Nutrition;
