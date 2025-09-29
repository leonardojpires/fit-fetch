function Container({ children }) {
    return (
        <main className="mx-auto flex flex-col items-center bg-[var(--background)]">
            { children }
        </main>
    )
}

export default Container;
