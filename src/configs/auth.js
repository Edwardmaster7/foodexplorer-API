const fs = require('fs');
const jwt = require('jsonwebtoken');

// Read the private key from the file
const secretKey = fs.readFileSync('private.pem', 'utf8');

// Sign a new JWT token
const signToken = (payload) => {
  console.log(payload);
  console.log(secretKey);
  return jwt.sign(payload, secretKey, { algorithm: 'RS256', expiresIn: '1h' });
};

// Verify a JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        // Token is invalid
        reject(err);
      } else {
        // Token is valid
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  signToken,
  verifyToken,
};
