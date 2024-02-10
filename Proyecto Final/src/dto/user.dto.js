export default class UserDto {
    constructor(user) {
      this.first_name = user.first_name;
      this.email = user.email;
      this.rol = user.rol;
    }
  }