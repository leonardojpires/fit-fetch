import "./index.css";
import LoginForm from "./../../components/LoginForm/index";
import RegisterForm from "./../../components/RegisterForm/index";
import { useState } from "react";
import useRedirectIfAuth from "../../hooks/useAuthHook";
import { motion } from "framer-motion";

function AuthPage() {
  const [form, setForm] = useState("login");

  const { loading } = useRedirectIfAuth();

  if (loading) return null;

  return (
    <section className="max-lg-[1200px] w-full !px-3 !mt-30 !mb-40 lg:!px-[5rem] flex flex-row z-1">
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
        {form === "login" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center"
          >
            <LoginForm clickEvent={() => setForm("register")} />
          </motion.div>
        )}

        {form === "register" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center"
          >
            <RegisterForm clickEvent={() => setForm("login")} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default AuthPage;
