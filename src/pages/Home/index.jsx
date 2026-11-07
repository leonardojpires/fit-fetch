import { lazy, Suspense, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import Hero from "../../components/Home/Hero";
import About from "../../components/Home/About";
import "./index.css";

const Services = lazy(() => import("../../components/Home/Services"));
const Testimonials = lazy(() => import("../../components/Home/Testimonials"));
const CTA = lazy(() => import("../../components/Home/CTA"));

function SectionReveal({ children }) {
  const reduceMotion = useReducedMotion();

  return (
    <Motion.div
      className="ff-section-reveal"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Motion.div>
  );
}

export default function Home() {
  const [motionPaused, setMotionPaused] = useState(false);

  return (
    <div className="ff-home" lang="pt-PT" data-motion-paused={motionPaused}>
      <SectionReveal>
        <Hero
          motionPaused={motionPaused}
          onToggleMotion={() => setMotionPaused((paused) => !paused)}
        />
      </SectionReveal>
      <SectionReveal>
        <About />
      </SectionReveal>
      <Suspense fallback={<div className="w-full h-40"></div>}>
        <SectionReveal>
          <Services />
        </SectionReveal>
        <SectionReveal>
          <Testimonials />
        </SectionReveal>
        <SectionReveal>
          <CTA />
        </SectionReveal>
      </Suspense>
    </div>
  );
}
