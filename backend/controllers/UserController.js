import admin from '../firebase/firebaseAdmin.js';
import User from '../models/user.js';
import crypto from 'crypto';

class UserController {
    static errorMessage = "Erro interno do servidor";

    static async syncUser(req, res) {
        try {
            let token = req.headers.authorization || '';
            if (!token) return res.status(401).json({ message: 'Nenhum token encontrada' });

            if (token.startsWith('Bearer')) {
                token = token.split(' ')[1];
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            // console.log('Decoded Firebase Token:', decodedToken);

            // Prefer fresh data from Firebase Admin to avoid stale token claims
            let fbUserRecord = null;
            try {
                fbUserRecord = await admin.auth().getUser(decodedToken.uid);
            } catch(fetchErr) {
                // console.error('Erro ao obter utilizador do Firebase:', fetchErr);
            }

            const displayName = fbUserRecord?.displayName ?? decodedToken.name ?? null;
            const photoURL = fbUserRecord?.photoURL ?? decodedToken.picture ?? null;

            let user = await User.findOne({ where: { firebase_uid: decodedToken.uid } })

            if (!user && decodedToken.email) {
                user = await User.findOne({ where: { email: decodedToken.email } });
            }

            if (user) {
                if (user.firebase_uid !== decodedToken.uid) {
                    user.firebase_uid = decodedToken.uid;
                }

                await user.update({
                    name: displayName || user.name || decodedToken.email?.split('@')[0] || 'Utilizador',
                    avatarUrl: photoURL || user.avatarUrl
                });

                return res.json({ user, created: false });
            }

            const newUser = await User.create({
                firebase_uid: decodedToken.uid,
                name: displayName || decodedToken.email?.split('@')[0] || 'Utilizador',
                email: decodedToken.email,
                role: 'user',
                avatarUrl: photoURL || null,
            });

            res.json({ user: newUser, created: true });
        } catch(err) {
            // console.error(err);
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
            // console.log(err);
            res.status(500).json({ error: 'Erro ao buscar o utilizador atual' });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch(err) {
            // console.error("Erro ao buscar o número total de utilizadores:", err);
            return res.status(500).json({ message: UserController.errorMessage });
        }
    }

    static async getUserById(req, res) {
        try {
             const { userId } = req.params;

             const user = await User.findByPk(userId);
             if (!user) return res.status(404).json({ message: "Utilizador não encontrado!" });

             return res.status(200).json({ user });
        } catch(err) {
            // console.error("Erro ao buscar utilizador por ID: ", err);
            return res.status(500).json({ message: UserController.errorMessage });
        }
    }

    static async addUser(req, res) {
        try {
            const { name, email, role = 'user' , password } = req.body;

            if (!name) return res.status(400).json({ message: "O nome é obrigatório!" });
            if (!email) return res.status(400).json({ message: "O email é obrigatório!" });
            if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: "Cargo inválido!" });

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(409).json({ message: "E-Mail já registrado!" })

            const tmpPassword = password || crypto.randomBytes(6).toString('base64');

            const firebaseUser = await admin.auth().createUser({
                email,
                password: tmpPassword,
                displayName: name
            });

            await admin.auth().setCustomUserClaims(firebaseUser.uid, { role});

            const newUser = await User.create({
                firebase_uid: firebaseUser.uid,
                name,
                email,
                role,
                avatarUrl: null,
            });

            return res.status(201).json({
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    avatarUrl: newUser.avatarUrl
                },
                tempPassword: tmpPassword
            });

        } catch(err) {
            // console.error("Erro ao adicionar utilizador: ", err);
            return res.status(500).json({ message: UserController.errorMessage })
        }
    }

    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { name, email, role } = req.body;

            if (!name) return res.status(400).json({ message: "O nome é obrigatório!" });
            if (!email) return res.status(400).json({ message: "O email é obrigatório!" });
            if (role && !['user', 'admin'].includes(role)) return res.status(400).json({ message: "Cargo inválido!" });

            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ message: "Utilizador não encontrado!" });

            const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : user.avatarUrl;

            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) return res.status(409).json({ message: "E-Mail já registrado!" });
            }

            const updates = {}
            if (name) updates.displayName = name;
            if (email) updates.email = email;

            if (Object.keys(updates).length > 0) await admin.auth().updateUser(user.firebase_uid, updates);

            /* Prevent user from changing their own role */
            if (user.firebase_uid === req.user.firebase_uid && role) {
                return res.status(401).json({ message: "Não é possível alterar o próprio cargo!" })
            }

            if (role) {
                await admin.auth().setCustomUserClaims(user.firebase_uid, { role })
            }

            await user.update({ name: name || user.name, email: email || user.email, role: role || user.role, avatarUrl });

            return res.status(200).json(user);
        } catch(err) {
            // console.error("Erro ao atualizar utilizador: ", err);
            return res.status(500).json({ message: UserController.errorMessage });
        }
    }

    static async updateCurrentUser(req, res) {
        try {
            const user = await User.findOne({ where: { firebase_uid: req.user.firebase_uid } });

            if (!user) return res.status(404).json({ message: "Utilizador não encontrado!" });

            const { name } = req.body;
            const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : user.avatarUrl;

            // Updates the Firebase name if provided
            if (name) {
                try {
                    await admin.auth().updateUser(user.firebase_uid, {
                        displayName: name
                    });
                    // console.log(`Utilizador ${user.firebase_uid} atualizado no Firebase com nome: ${name}`);
                } catch(fbErr) {
                    // console.error(`Erro ao atualizar nome no Firebase:`, fbErr);
                }
            }

            // Updates the local database
            await user.update({ name: name || user.name, avatarUrl });
            // console.log(`Utilizador ${user.id} atualizado na BD`);
            
            return res.status(200).json(user);
        } catch(err) {
            // console.error("Erro ao atualizar o utilizador atual: ", err);
            return res.status(500).json({ message: UserController.errorMessage });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ message: "Utilizador não encontrado!" });
            if (user.firebase_uid === req.user.firebase_uid) return res.status(400).json({ message: "Não é possível eliminar o utilizador atual!" });
            await admin.auth().deleteUser(user.firebase_uid);
            await user.destroy();

            return res.status(200).json({ message: "Utilizador eliminado com sucesso!" });
        } catch(err) {
            // console.error("Erro ao eliminar utilizador: ", err);
            return res.status(500).json({ message: UserController.errorMessage });
        }
    }
}

export default UserController;
