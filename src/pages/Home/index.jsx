import Hero from "../../components/Home/Hero/index";
import Services from "../../components/Home/Services";
import About from "./../../components/Home/About/index";
import Testimonials from "../../components/Home/Testimonials/index";
import CTA from "./../../components/Home/CTA/index";
import SlideUpComponent from "./../../components/Other/SlideUp/index";
import { motion } from "framer-motion";

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
    </>
  );
}

export default Home;
