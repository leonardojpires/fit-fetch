import './index.css';
import TestimonialsCards from './TestimonialsCards';
import testimonials from './Testimonials';
import { useState } from 'react';

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const total = testimonials.length;

    const next = () => setCurrent((prev) => (prev + 1) % total);
    const prev = () => setCurrent((prev) => (prev -1) % total);

  return (
    <section className="section !max-w-[1200px]">
      <h2 className="title font-headline !mb-5">
        Vê o que os nossos membros dizem
      </h2>

      <div className="testimonials-div">
        <div className="flex gap-5 transation-transform duration-500" style={{ transform: `translateX(-${current * 50}%)` }}>
            {testimonials.map((t, index) => (
                <div key={index} className="flex-shrink-0 w-1/2">
                <TestimonialsCards
                    image={t.image}
                    name={t.name}
                    stars={t.stars}
                    text={t.text}
                />
                </div>
            ))}
        </div>

        <button onClick={prev} className="arrows left-2">
            &lt;
        </button>

        <button onClick={next} className="arrows right-2">
            &gt;
        </button>

      </div>
    </section>
  );
}
