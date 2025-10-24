import "./index.css";
import LoginForm from './../../components/LoginForm/index';
import RegisterForm from './../../components/RegisterForm/index';
import { useState } from "react";
import useRedirectIfAuth from "../../Hooks/useAuthHook";


function AuthPage() {
  const [ form, setForm ] = useState('login');
  
  useRedirectIfAuth();

  return (
    <section className="max-lg-[1200px] w-full !px-3 !mt-40 !mb-40 lg:!px-[5rem] flex flex-row z-1">

      <div className="panel-bg"></div>
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">

        { form === "login" && (
          <div className="w-full flex justify-center items-center scale-in-ver-bottom">
            <LoginForm clickEvent={() => setForm('register')} />
          </div>
        )}
      
        { form === "register" && (
          <div className="w-full flex justify-center items-center scale-in-ver-bottom">
            <RegisterForm clickEvent={() => setForm('login')} />
          </div>
        ) }

      </div>
    </section>
  );
}

export default AuthPage;
