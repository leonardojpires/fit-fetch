import Hero from '../../components/Home/Hero/index';
import Services from '../../components/Home/Services';
import About from './../../components/Home/About/index';
import Testimonials from '../../components/Home/Testimonials/index';
import CTA from './../../components/Home/CTA/index';

function Home() {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <Testimonials />
            <CTA />
        </>
        
    )
}

export default Home;
