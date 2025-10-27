import './index.css';
import Cards from './Cards/index';
import services from './servicesData.js';

function Services() {
    return (
        <section className="section !mt-20 !mb-10">
            <h3 className="title font-body !mb-10">O que o Fit Fetch oferece</h3>

            <div className="services-div">
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
