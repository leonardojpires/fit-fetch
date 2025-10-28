import "dotenv/config";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from "./config/db.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/users', userRouter)

app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send("Servidor a correr e base de dados conectada!");
    } catch(err) {
        console.error('DB connection error:', err);
        res.status(500).send("Erro ao conectar à base de dados.");
    }
    
})

app.listen(3000, () => {
    console.log(`Servidor em http://localhost:${process.env.PORT || 3000}/`);
});