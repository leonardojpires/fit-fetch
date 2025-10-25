import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.js';

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

            const [ user, created ] = await User.findOrCreate({
                where: { firebase_uid: decodedToken.uid },
                defaults: {
                    name: decodedToken.name || 'Utilizador sem nome',
                    email: decodedToken.email,
                    role: 'user'
                }
            });

            if (!created) {
                await user.update({
                    name: decodedToken.name || user.name,
                    email: decodedToken.email || user.email
                });
            }

            res.json({ user, created });
        } catch(err) {
            console.error(err);
            res.status(401).json({ error: 'Token inválido ou expirado' });
        }
    }
}

export default UserController;
