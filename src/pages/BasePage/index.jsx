import { Outlet } from 'react-router-dom';
import Header from './../../components/Header/index';
import Container from './../../components/Container/index';
import Footer from './../../components/Footer/index';

    function BasePage() {
        return (
            <>
                <Header />
                <main id="main-content">
                    <Container>
                        <Outlet />
                    </Container>
                </main>
                <Footer />
            </>
        )
    }

    export default BasePage;
