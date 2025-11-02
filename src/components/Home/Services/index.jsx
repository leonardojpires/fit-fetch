import './index.css';
import Cards from './Cards/index';
import services from './servicesData.js';

function Services() {
    return (
        <section className="section !mt-20 !mb-10">
            <h3 className="title font-headline !mb-5">O que o Fit Fetch oferece</h3>
            <p className="description font-body !mb-10">As ferramentas disponíveis no Fit Fetch que te permitem desbloquear o teu potencial, foco e força</p>

            <div className="services-div !mt-0"> 
                {services.map((service, index) => (
                    <Cards
                        key={index}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                    />
                ))}
            </div>

        </section>
    )
}

export default Services;
