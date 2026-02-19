import { lazy, Suspense } from "react";
import Hero from "../../components/Home/Hero/index";
import About from "./../../components/Home/About/index";
import { motion } from "framer-motion";

const Services = lazy(() => import("../../components/Home/Services"));
const Testimonials = lazy(() => import("../../components/Home/Testimonials/index"));
const CTA = lazy(() => import("./../../components/Home/CTA/index"));

function Home() {
  return (
    <>
      <Hero />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.div>

      <Suspense fallback={<div className="w-full h-40"></div>}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Services />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Testimonials />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <CTA />
        </motion.div>
      </Suspense>
    </>
  );
}

export default Home;
