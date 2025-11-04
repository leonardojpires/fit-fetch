    import admin from "../firebase/firebaseAdmin.js";


    const verifyFirebaseToken = async (req, res, next) => {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Token não encontrado' });
        }

        if (token.startsWith('Bearer')) {
            token = token.split(' ')[1];
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                firebase_uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name,
                role: decodedToken.role || 'user',
            }
            next();
        } catch(err) {
            console.error("Erro ao verificar o token Firebase: ", err);
            return res.status(401).json({ message: "Token inválido ou expirado" });
        }
    }

    export default verifyFirebaseToken;
