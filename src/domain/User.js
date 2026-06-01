class User {
  constructor(id, name, email, password, rating = 0) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.rating = rating;
    this.initials = this.#generateInitials(name);
  }

  #generateInitials(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }

    return name
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      initials: this.initials,
      rating: this.rating
    };
  }
}

module.exports = User;