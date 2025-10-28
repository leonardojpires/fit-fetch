function Cards({ icon, title, description }) {
  return (
    <div className="h-full flex items-stretch hover:scale-[1.02] hover:cursor-pointer transition-all">
      <div className="flex flex-col max-w-sm w-full border border-white/60 bg-gradient-to-t from-white/40 bg-white backdrop-blur-[20px] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all h-full">
        <div className="relative">
          <img 
            src={icon}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-40 object-cover"
          />
        </div>

        <div className="p-5 flex flex-col justify-between flex-1">
          <div className="!p-4">
            <h3 className="text-xl font-bold font-body text-[var(--primary)] !mb-2">{title}</h3>
            <p className="text-gray-500 font-body">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Cards;
