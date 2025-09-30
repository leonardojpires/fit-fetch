import './index.css';

function Container({ children }) {
    return (
        <main className="mx-auto flex flex-col items-center">
            { children }
        </main>
    )
}

export default Container;
