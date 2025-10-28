import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasePage from './../pages/BasePage/index';
import Home from './../pages/Home/index';
import Workout from './../pages/Workout/index';
import Nutrition from './../pages/Nutrition/index';
import Contact from './../pages/Contact/index';
import NotFound from "../pages/404";
import AuthPage from './../pages/Auth/index';
import Dashboard from "../pages/admin/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BasePage />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/treinos" element={<Workout />}></Route>
                    <Route path="/nutricao" element={<Nutrition />}></Route>
                    <Route path="/contacto" element={<Contact />}></Route>
                    <Route path="/entrar" element={<AuthPage />}></Route>
                    <Route path="/admin" element={<Dashboard />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
