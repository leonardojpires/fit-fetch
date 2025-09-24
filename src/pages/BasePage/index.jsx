    import { Outlet } from 'react-router-dom';
    import Header from './../../components/Header/index';
    import Container from './../../components/Container/index';

    function BasePage() {
        return (
            <>
                <Header />
                <Container>
                    <Outlet />
                </Container>
            </>
        )
    }

    export default BasePage;
