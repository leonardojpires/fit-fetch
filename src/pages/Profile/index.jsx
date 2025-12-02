

function Profile() {
    return (
        <section className="w-full">
            <div className="section !mt-40 flex flex-row gap-25">
                {/* Sidebar Profile */}
                <div className="w-1/4 flex flex-col items-center gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/pt/9/97/BackFuturePoster.jpg" alt="Imagem de perfil" className="w-3/4 mx-auto aspect-square object-cover rounded-full pointer-events-none" width="50" height="50"/>
                    <h2 className="font-headline font-medium text-lg">Nome do Utilizador</h2>
                </div>
                {/* Main Profile Content */}
                <div className="w-3/4">
                    <h1 className="font-headline font-medium text-2xl !mb-5 ">Os Meus Planos</h1>
                </div>
            </div>
        </section>
    )
}

export default Profile;
