import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';

class UserController {
    static async syncUser(req, res) {
        try {
            let token = req.headers.authorization || '';
            if (!token) return res.status(401).json({ message: 'Nenhum token encontrada' });

            if (token.startsWith('Bearer')) {
                token = token.split(' ')[1];
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log('Decoded Firebase Token:', decodedToken);

            let user = await User.findOne({ where: { firebase_uid: decodedToken.uid } })

            if (!user && decodedToken.email) {
                user = await User.findOne({ where: { email: decodedToken.email } });
            }

            if (user) {
                if (user.firebase_uid !== decodedToken.uid) {
                    user.firebase_uid = decodedToken.uid;
                }

                await user.update({
                    name: decodedToken.name || user.name,
                    avatarUrl: decodedToken.picture || user.avatarUrl
                });

                return res.json({ user, created: false });
            }

            const newUser = await User.create({
                firebase_uid: decodedToken.uid,
                name: decodedToken.name || 'Utilizador sem nome',
                email: decodedToken.email,
                role: 'user',
                avatarUrl: decodedToken.picture || null,
            });

            res.json({ user: newUser, created: true });
        } catch(err) {
            console.error(err);
            res.status(401).json({ error: 'Token inválido ou expirado' });
        }
    }

    static async getCurrentUser(req, res) {
        try {
            const user = await User.findOne({ where: { firebase_uid: req.user.firebase_uid } });
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            });
        } catch(err) {
            console.log(err);
            res.status(500).json({ error: 'Erro ao buscar o utilizador atual' });
        }
    }
}

export default UserController;
