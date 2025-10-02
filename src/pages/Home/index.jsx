import Hero from '../../components/Home/Hero/index';
import Services from '../../components/Home/Services';
import About from './../../components/Home/About/index';
import Testimonials from '../../components/Home/Testimonials/index';
import CTA from './../../components/Home/CTA/index';
import SlideUpComponent from './../../components/Other/SlideUp/index';

function Home() {
    return (
        <>
            <Hero />
            <SlideUpComponent>
                <About />
            </SlideUpComponent>

            <SlideUpComponent>
                <Services />
            </SlideUpComponent>

            <SlideUpComponent>
                <Testimonials />
            </SlideUpComponent>

            <SlideUpComponent>
                <CTA />
            </SlideUpComponent>
        </>
        
    )
}

export default Home;
