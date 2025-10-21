import admin from '../firebase/firebaseAdmin.js';
import User from '../models/User.js';

class UserController {
    static async syncUser(req, res) {
        try {
            console.log('Authorization header:', req.headers.authorization);
            let token = req.headers.authorization || '';
            if (!token) return res.status(401).json({ message: 'Nenhum token encontrada' });

            if (token.startsWith('Bearer')) {
                token = token.split(' ')[1];
            }

            // Debug: log token length (do NOT log full token in production)
            console.log('Received token length:', token ? token.length : 0);

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
            console.error('Token verification error:', err);
            // Return detailed error during development for debugging
            res.status(401).json({ error: err.message || 'Token inválido ou expirado', details: err });
        }
    }
}

export default UserController;
