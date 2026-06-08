import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { UserSQLAdapter } from './adapters/db/UserSQLAdapter.js';
import { UserController } from './adapters/http/UserController.js';
import { createRoutes } from './adapters/http/routes.js';
import { UserService } from './application/UserService.js';
import { FirebaseAuthAdapter } from './adapters/auth/FirebaseAuthAdapter.js';

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
const firebaseAuth = new FirebaseAuthAdapter();
const userController = new UserController(userService, firebaseAuth);

app.use('/api/v1/users', createRoutes(userController, firebaseAuth));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`[ms_usuarios] escuchando en puerto ${PORT}`);
});

export default app;
