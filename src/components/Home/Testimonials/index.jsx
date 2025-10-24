import './index.css';
import TestimonialsCards from './TestimonialsCards';
import testimonials from './Testimonials';

export default function Testimonials() {
  return (
    <section className="section !mt-20 !max-w-[1200px]">
      <h2 className="title font-headline">
        Vê o que os nossos membros dizem
      </h2>

      <div className="testimonials-div relative overflow-hidden w-full !py-10">
        <div className="flex flex-col justify-center items-stretch gap-5 transation-transform duration-500 lg:flex-row">
            {testimonials.map((t, index) => (
                <div key={index} className={`flex-1 w-full lg:w-1/2 ${ t.up ? 'up' : 'down' } `}>
                <TestimonialsCards
                    image={t.image}
                    name={t.name}
                    stars={t.stars}
                    text={t.text}
                />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
