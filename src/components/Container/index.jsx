function Container({ children }) {
    return (
        <section className="container mx-auto flex flex-col items-center">
            { children }
        </section>
    )
}

export default Container;
