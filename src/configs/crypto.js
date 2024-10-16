const bcrypt = require("bcrypt");
const saltRounds = 10;

const encrypt = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
}

const compare = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

module.exports = { encrypt, compare };