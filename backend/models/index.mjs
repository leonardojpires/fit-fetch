import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

for (const file of fs.readdirSync(__dirname)) {
  if (file === path.basename(__filename)) continue;
  if (!file.endsWith('.js') && !file.endsWith('.mjs')) continue;
  const modelPath = path.join(__dirname, file);
  const mod = await import(pathToFileURL(modelPath).href);
  const modelFactory = mod.default;
  
  if (typeof modelFactory === 'function') {
    // Verifica se é uma classe (já inicializada) ou factory function
    if (modelFactory.prototype && modelFactory.prototype.constructor === modelFactory) {
      // É uma classe ES6 já definida (ex: Exercicio)
      db[modelFactory.name] = modelFactory;
    } else {
      // É uma factory function (ex: Alimento)
      const model = modelFactory(sequelize, DataTypes);
      db[model.name] = model;
    }
  }
}

Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
