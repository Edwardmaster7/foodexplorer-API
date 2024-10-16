const AppError = require('../utils/AppError');

async function isAdmin (req, res, next) {
    // console.log(req.user.isAdmin);

    if (req.user.isAdmin === true) {
      return next();
    } else {
      throw new AppError('Insuficient privileges to perform this action', 403);
    }
  };

module.exports = isAdmin;