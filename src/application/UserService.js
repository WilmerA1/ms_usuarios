import { User } from '../domain/User.js'; 

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async registerUser({ name, email, password }) {        
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const id = crypto.randomUUID(); 
        const newUser = new User(id, name, email, password); 
        
        return await this.userRepository.save(newUser);
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
            initials: user.initials,
            rating: user.rating
        };
    }
}