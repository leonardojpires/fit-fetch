import "./index.css";
import LoginForm from "./../../components/LoginForm/index";
import RegisterForm from "./../../components/RegisterForm/index";
import { useState } from "react";
import useRedirectIfAuth from "../../hooks/useAuthHook";
import AuthLayout from "../../components/AuthLayout";

function AuthPage() {
  const [form, setForm] = useState("login");

  const { loading } = useRedirectIfAuth();

  if (loading) return null;

  return (
    <AuthLayout>
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
        {form === "login" && (
          <div className="ff-auth-form-slot">
            <LoginForm clickEvent={() => setForm("register")} />
          </div>
        )}

        {form === "register" && (
          <div className="ff-auth-form-slot">
            <RegisterForm clickEvent={() => setForm("login")} />
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default AuthPage;
