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
            request.input('university', sql.VarChar(255), user.university ?? 'No especificada');

            const query = `
                INSERT INTO Users (id, name, email, password_hash, initials, university)
                VALUES (@id, @name, @email, @password_hash, @initials, @university)
            `;
            await request.query(query);
            return user;
        } catch (error) {
            console.error('Error en UserSQLAdapter.save:', error.message);
            throw new Error('Database persistence failure');
        }
    }

    async findById(id) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('id', sql.VarChar(36), id);
            const query = `SELECT id, name, email, password_hash, initials, rating, university FROM Users WHERE id = @id`;

            const result = await request.query(query);
            if (result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return {
                id: row.id,
                name: row.name,
                email: row.email,
                passwordHash: row.password_hash,
                initials: row.initials,
                rating: parseFloat(row.rating),
                university: row.university ?? 'No especificada'
            };
        } catch (error) {
            console.error('Error en UserSQLAdapter.findById:', error.message);
            throw new Error('Database query failure');
        }
    }

    async findByEmail(email) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('email', sql.VarChar(150), email);
            const query = `SELECT id, name, email, password_hash, initials, rating, university FROM Users WHERE email = @email`;

            const result = await request.query(query);
            if (result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return {
                id: row.id,
                name: row.name,
                email: row.email,
                passwordHash: row.password_hash,
                initials: row.initials,
                rating: parseFloat(row.rating),
                university: row.university ?? 'No especificada'
            };
        } catch (error) {
            console.error('Error en UserSQLAdapter.findByEmail:', error.message);
            throw new Error('Database query failure');
        }
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    async saveReview(review) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('id', sql.VarChar(36), review.id);
            request.input('userId', sql.VarChar(36), review.userId);
            request.input('reviewerName', sql.VarChar(100), review.reviewerName);
            request.input('text', sql.VarChar(500), review.text);
            request.input('stars', sql.Int, review.stars);

            const query = `
                INSERT INTO UserReviews (id, userId, reviewerName, text, stars)
                VALUES (@id, @userId, @reviewerName, @text, @stars)
            `;
            await request.query(query);
            return review;
        } catch (error) {
            console.error('Error en UserSQLAdapter.saveReview:', error.message);
            throw new Error('Database persistence failure');
        }
    }

    async findReviewsByUserId(userId) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('userId', sql.VarChar(36), userId);
            const query = `
                SELECT id, userId, reviewerName, text, stars, createdAt
                FROM UserReviews
                WHERE userId = @userId
                ORDER BY createdAt DESC
            `;

            const result = await request.query(query);
            return result.recordset.map(row => ({
                id: row.id,
                userId: row.userId,
                reviewerName: row.reviewerName,
                text: row.text,
                stars: row.stars,
                createdAt: row.createdAt
            }));
        } catch (error) {
            console.error('Error en UserSQLAdapter.findReviewsByUserId:', error.message);
            throw new Error('Database query failure');
        }
    }

    async updateRating(userId, newRating) {
        try {
            const connection = await this._getConnection();
            const request = connection.request();

            request.input('userId', sql.VarChar(36), userId);
            request.input('rating', sql.Float, newRating);

            const query = `UPDATE Users SET rating = @rating WHERE id = @userId`;
            await request.query(query);
        } catch (error) {
            console.error('Error en UserSQLAdapter.updateRating:', error.message);
            throw new Error('Database update failure');
        }
    }
}