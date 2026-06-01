import sql from 'mssql';

export class UserSQLAdapter {
    constructor(config) {
        this.dbConfig = {
            user: config.dbUser,
            password: config.dbPassword,
            server: config.dbServer, 
            database: config.dbName,
            options: {
                encrypt: true, 
                trustServerCertificate: false
            }
        };
        this.pool = null;
    }

    async _getConnection() {
        if (!this.pool) {
            this.pool = await sql.connect(this.dbConfig);
        }
        return this.pool;
    }

    async save(user) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();
        
            request.input('id', sql.VarChar(36), user.id);
            request.input('name', sql.VarChar(100), user.name);
            request.input('email', sql.VarChar(150), user.email);
            request.input('password_hash', sql.VarChar(255), user.passwordHash);
            request.input('initials', sql.VarChar(5), user.initials);

            const query = `
                INSERT INTO Users (id, name, email, password_hash, initials)
                VALUES (@id, @name, @email, @password_hash, @initials)
            `;
            await request.query(query);
            return user;
        } catch (error) {
            console.error('Error en UserSQLAdapter.save:', error.message);
            throw new Error('Database persistence failure');
        }
    }

    async findByEmail(email) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('email', sql.VarChar(150), email);
            const query = `SELECT id, name, email, password_hash, initials, rating FROM Users WHERE email = @email`;
            
            const result = await request.query(query);
            if (result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return {
                id: row.id,
                name: row.name,
                email: row.email,
                passwordHash: row.password_hash,
                initials: row.initials,
                rating: parseFloat(row.rating)
            };
        } catch (error) {
            console.error('Error en UserSQLAdapter.findByEmail:', error.message);
            throw new Error('Database query failure');
        }
    }
}