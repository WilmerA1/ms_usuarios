import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { UserSQLAdapter } from './adapters/db/UserSQLAdapter.js';
import { UserController } from './adapters/http/UserController.js';
import { createRoutes } from './adapters/http/routes.js';
import { UserService } from './application/UserService.js'; 

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbServer: process.env.DB_SERVER,
    dbName: process.env.DB_NAME
};

const userRepository = new UserSQLAdapter(dbConfig);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use('/api/v1/users', createRoutes(userController));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`[ms_usuarios] escuchando en puerto ${PORT} y conectado a Azure SQL`);
});

export default app;