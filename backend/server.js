import "dotenv/config";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Servidor a correr e base de dados conectada!");
})

app.listen(3000, () => {
    console.log(`Servidor a correr na porta ${process.env.PORT || 3000}`);
});