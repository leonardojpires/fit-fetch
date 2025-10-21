import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log("Ligação à base de dados via Sequelize bem sucedida."))
    .catch(err => console.error("Erro ao ligar à base de dados via Sequelize: ", err));