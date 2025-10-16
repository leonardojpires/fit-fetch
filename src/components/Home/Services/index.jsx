import './index.css';
import Cards from './Cards/index';


function Services() {
    return (
        <section className="section !mb-10">
            <h3 className="title font-body !mb-10">O que o Fit Fetch oferece</h3>

            <div className="services-div">
                <Cards icon="https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg" title="Planos de Treino" description="Cria o teu plano de treino baseado nos teus objetivos diários" />

                <Cards icon="https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg" title="Nutrição Adequada" description="A tua nutrição adequada ao teu estilo de vida" />

                <Cards icon="https://images.pexels.com/photos/843227/pexels-photo-843227.jpeg" title="Dicas de Melhoria" description="Sistema integrado com IA que te aconselha da melhor forma" />

                <Cards icon="https://images.pexels.com/photos/7900031/pexels-photo-7900031.jpeg" title="Histórico de Treinos" description="Acompanha a tua evolução nos teus treinos" />

                <Cards icon="https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg" title="Exportação PDF" description="Leva contigo os teus planos para onde fores" />

                <Cards icon="https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg" title="Organização e Intuitividade" description="A melhor forma de gerir e organizar o teu progresso" />

            </div>

        </section>
    )
}

export default Services;
