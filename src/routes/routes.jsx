import { BrowserRouter, Routes, Route } from "react-router-dom";
import BasePage from './../pages/BasePage/index';
import Home from './../pages/Home/index';
import Workout from './../pages/Workout/index';
import Nutrition from './../pages/Nutrition/index';
import Contact from './../pages/Contact/index';
import NotFound from "../pages/404";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BasePage />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/treinos" element={<Workout />}></Route>
                    <Route path="/nutricao" element={<Nutrition />}></Route>
                    <Route path="/contacto" element={<Contact />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
