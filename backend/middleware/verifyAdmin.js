const verifyAdmin = async (req, res, next) => {
    const allowedRole = 'admin';

    try {
        if (req.user.role !== allowedRole) {
            return res.status(403).json({ message: "Acesso negado!" });
        }
        next();
    } catch(err) {
        // console.error("Erro ao verificar as permissões de administrador: ", err);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

export default verifyAdmin;
