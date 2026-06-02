export class User {
  constructor(id, name, email, password, rating = 5.0, university = 'No especificada') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = password;
    this.rating = rating;
    this.university = university;
    this.initials = this.#generateInitials(name);
  }

  #generateInitials(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }

    const trimmedName = name.trim();
  
    if (trimmedName.includes(' ')) {
      return trimmedName
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
    } else {
      return trimmedName.substring(0, 2).toUpperCase();
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      university: this.university,
      initials: this.initials,
      rating: this.rating
    };
  }
}