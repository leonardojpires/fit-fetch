import './index.css';
import { CgGym } from "react-icons/cg";
import { GiStrong } from "react-icons/gi";
import { IoNutritionSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";


function About() {
    return (
        <section id="sobre" className="section !mt-40">

            <div className="h-[3px] bg-[var(--secondary)] !mb-5"></div>

            <div className="title-div font-headline">
                <h2 className="title">O que é o Fit Fetch?</h2>
                <CgGym className="text-[var(--primary)]" />
            </div>

            <p className="description font-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis cum placeat consequatur, rem ipsam accusantium fugiat odio eaque, illo at recusandae perferendis quae nesciunt tempora pariatur, mollitia quo tenetur voluptates. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, voluptas a. Et quaerat quidem ipsa tempore eos, nesciunt voluptatem vitae ipsam placeat, sapiente repudiandae sint nisi rem, voluptatum nulla voluptates? Lorem</p>

            <div className="cards-section font-body">

                <div className="card">
                    <GiStrong className="card-icon" />
                    <span className="card-text">Treina com alma</span>
                </div>

                <div className="card">
                    <IoNutritionSharp className="card-icon" />
                    <span className="card-text">Nutrição sem fim</span>
                </div>

                <div className="card">
                    <FaStar className="card-icon" />
                    <span className="card-text">Saudável e equilibrado</span>
                </div>
                
            </div>

        </section>
    )
}

export default About;
