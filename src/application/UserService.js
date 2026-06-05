import { User } from '../domain/User.js'; 

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async registerUser({ name, email, password, university = 'No especificada' }) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const id = crypto.randomUUID();
        const newUser = new User(id, name, email, password, 5.0, university);

        return await this.userRepository.save(newUser);
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            university: user.university ?? 'No especificada',
            initials: user.initials,
            rating: user.rating
        };
    }

    async loginUser({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.passwordHash !== password) {
            throw new Error('Invalid email or password');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            university: user.university ?? 'No especificada',
            initials: user.initials,
            rating: user.rating
        };
    }
}