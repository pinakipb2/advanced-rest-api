/* User "DTO" (Data Transfer Object)
  -> Takes in a User and returns the necessary user info
*/
class userDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}

export default userDTO;
