const checkAdmin = (req, res, next) => {
    const user = req.user;

    if (user && user.role !== 'admin') {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar esta operação" });
    }
    next();
}

export default checkAdmin;
