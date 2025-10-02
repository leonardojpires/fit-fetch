function TestimonialsCards({ name, image, stars, text }) {
    return (
        <div className="h-full flex flex-col bg-white !p-4 rounded-2xl shadow-xl">
            <div className="flex flex-row items-center gap-3 !mb-3">
                <img src={ image } alt={ name } className="w-16 h-16 pointer-events-none rounded-full shadow-xl" />
                <span className="text-lg font-body font-semibold text-[var(--primary)]">{ name }</span>
            </div>
            <span className="font-body !mb-2">{ "⭐".repeat(stars) }</span>
            <p className="font-body">{ text }</p>
        </div>
    )
}

export default TestimonialsCards;
