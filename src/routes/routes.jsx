import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import BasePage from './../pages/BasePage/index';
import Home from './../pages/Home/index';
import NotFound from "../pages/404";

const Workout = lazy(() => import('./../pages/Workout/index'));
const Nutrition = lazy(() => import('./../pages/Nutrition/index'));
const Contact = lazy(() => import('./../pages/Contact/index'));
const AuthPage = lazy(() => import('./../pages/Auth/index'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const UsersPage = lazy(() => import('../pages/admin/Users'));
const ExercisesPage = lazy(() => import('./../pages/admin/Exercises/index'));
const FoodsPage = lazy(() => import('./../pages/admin/Foods/index'));
const Profile = lazy(() => import('./../pages/Profile/index'));
const WorkoutPlans = lazy(() => import('./../pages/WorkoutPlans/index'));
const HowItWorks = lazy(() => import('../pages/HowItWorks'));
const FAQ = lazy(() => import('../pages/FAQ'));
const NutritionPlans = lazy(() => import('./../pages/NutritionPlans/index'));
const Exercise = lazy(() => import('./../pages/Exercise/index'));
const Food = lazy(() => import('../pages/Food'));
const PasswordReset = lazy(() => import('../pages/PasswordReset'));

function LazyPage({ children }) {
    return (
        <Suspense fallback={<section className="loading-section">A carregar...</section>}>
            {children}
        </Suspense>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BasePage />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/como-funciona" element={<LazyPage><HowItWorks /></LazyPage>}></Route>
                    <Route path="/faq" element={<LazyPage><FAQ /></LazyPage>}></Route>
                    <Route path="/treinos" element={<LazyPage><Workout /></LazyPage>}></Route>
                    <Route path="/nutricao" element={<LazyPage><Nutrition /></LazyPage>}></Route>
                    <Route path="/contacto" element={<LazyPage><Contact /></LazyPage>}></Route>
                    <Route path="/entrar" element={<LazyPage><AuthPage /></LazyPage>}></Route>
                    <Route path="/perfil" element={<LazyPage><Profile /></LazyPage>}></Route>
                    <Route path="/plano-treino/:id" element={<LazyPage><WorkoutPlans /></LazyPage>}></Route>
                    <Route path="/plano-nutricao/:id" element={<LazyPage><NutritionPlans /></LazyPage>}></Route>
                    <Route path="/exercicio/:id" element={<LazyPage><Exercise /></LazyPage>}></Route>
                    <Route path="/alimento/:id" element={<LazyPage><Food /></LazyPage>}></Route>
                    <Route path="/recuperar-palavra-passe" element={<LazyPage><PasswordReset /></LazyPage>}></Route>

                    {/* ADMIN ROUTES */}
                    <Route path="/admin" element={<LazyPage><Dashboard /></LazyPage>}></Route>
                    <Route path="/admin/utilizadores" element={<LazyPage><UsersPage /></LazyPage>}></Route>
                    <Route path="/admin/exercicios" element={<LazyPage><ExercisesPage /></LazyPage>}></Route>
                    <Route path="/admin/alimentos" element={<LazyPage><FoodsPage /></LazyPage>}></Route>

                    {/* FALLBACK ROUTE */}
                    <Route path="*" element={<NotFound />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
