    import User from "../models/user.js";

    const attachUserFromDB = async (req, res, next) => {
        const { firebase_uid } = req.user;

        try {
            const user = await User.findOne({ where: { firebase_uid } });

            if (!user) {
                return res.status(404).json({ message: "Utilizador não encontrado!" });
            }

            req.user = {
                id: user.id,
                firebase_uid: user.firebase_uid,
                name: user.name,
                email: user.email,
                role: user.role
            }
            next();
        } catch (err) {
            console.error("Erro ao buscar o utilizador na base de dados: ", err);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    export default attachUserFromDB;
