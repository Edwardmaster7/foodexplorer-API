const AppError = require("../utils/AppError")

const knex = require("../database/knex")

const { encrypt, compare } = require("../configs/crypto")

class UsersController {
  // A controller should have up to 5 methods
  /**
   * index - GET to list all users
   * show - GET to show one user
   * create - POST to create a user
   * update - PUT to update a user
   * delete - DELETE to delete a user
   */

  async create(request, response) {
    const { name, email, password, isAdmin } = request.body

    const checkUserExists = await knex("Users")
      .where("email", email).first() === undefined ? false : true

    if (!name || !email) {
      throw new AppError("Name and email are required.")
    }

    if (checkUserExists) {
      throw new AppError("Email already in use.")
    }

    const hashed_pwd = await encrypt(password)

    await knex("Users").insert({ name, email, password:hashed_pwd, isAdmin: (isAdmin ? true : false) })

    // 201 - Created

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const userA = await knex("Users").where({ id:user_id })
    
    const user = userA[0];

    if (!user) {
      throw new AppError("User not found.")
    }

    // verify if email is already in use
    if (email) {
      const emailExists = await knex("Users")
        .where("email", email).first() === undefined ? false : true  

      // console.log(emailExists);

      if (emailExists && emailExists !== user.id) {
        throw new AppError("Email already in use.")
      }
    }

    if (password) {
      if (!old_password) {
        throw new AppError("Old password is required.")
      } else if (password === old_password) {
        throw new AppError("New password cannot be the same as old password.")
      } else {
        const isValid = await compare(old_password, user.password)
        // console.log(`old password: ${old_password}\nuser password: ${user.password}\nisValid: ${isValid}`)
        if (!isValid) {
          throw new AppError("Old password does not match.")
        }

        user.password = await encrypt(password)
      }
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    // user.avatar = request.file.filename?? user.avatar

    await knex("Users").where({ id:user_id }).update({ name:user.name, email:user.email, password:user.password, updated_at: knex.fn.now() });

    return response.json(user)
  }

  async show(request, response) {
    const { id } = request.params

    const user = await knex("Users").select("name", "email", "isAdmin", "created_at", "updated_at" ).where({ id }).first()

    if (!user) {
      throw new AppError("User not found.", 404)
    }

    return response.json(user)
  }
}

module.exports = UsersController
