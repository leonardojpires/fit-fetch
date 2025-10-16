import './index.css';
import { CgGym } from "react-icons/cg";
import aboutData from "./aboutData";

function About() {
    return (
        <section id="sobre" className="section !mt-20">

            <div className="title-div font-headline">
                <h2 className="title">O que é o Fit Fetch?</h2>
                <CgGym className="text-[var(--primary)]" />
            </div>

            <p className="description font-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis cum placeat consequatur, rem ipsam accusantium fugiat odio eaque, illo at recusandae perferendis quae nesciunt tempora pariatur, mollitia quo tenetur voluptates.</p>


            <div className="cards-section font-body">
                { aboutData.map((about, index) => {
                    const Icon = about.icon;
                    return (
                        <div key={index} className="card">
                            <div className="card-icon">
                                <Icon />
                            </div>
                            <h3 className="text-2xl font-bold font-headline">{ about.title }</h3>
                            <p className="text-lg text-black/50">{ about.description }</p>
                        </div>
                    )
                }) }
            </div>
        </section>
    )
}

export default About;
