const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { signToken } = require("../configs/auth")
const { compare } = require("../configs/crypto")

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    console.log(`email: ${email}, password: ${password}`)

    const user = await knex("Users").where('email', email).first()
    
    // console.log(`user ${JSON.stringify(user)}`)

    if (!user) {
      throw new AppError("Email and/or password incorrect.", 401)
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new AppError("Email and/or password incorrect.", 401)
    }

    console.log(`user id on sessionsController: ${user.id}`)

    const token = signToken({ userId: String(user.id), isAdmin: user.isAdmin })

    return response.json({ id:user.id, token, isAdmin: user.isAdmin })
  }
}

module.exports = SessionsController