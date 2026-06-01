export class UserRepository {
  async save(user) {
    throw new Error('Not implemented: save() method must be implemented by adapter');
  }

  async findByEmail(email) {
    throw new Error('Not implemented: findByEmail() method must be implemented by adapter');
  }

  async findById(id) {
    throw new Error('Not implemented: findById() method must be implemented by adapter');
  }

  async findAll() {
    throw new Error('Not implemented: findAll() method must be implemented by adapter');
  }

  async update(id, updates) {
    throw new Error('Not implemented: update() method must be implemented by adapter');
  }

  async delete(id) {
    throw new Error('Not implemented: delete() method must be implemented by adapter');
  }
}