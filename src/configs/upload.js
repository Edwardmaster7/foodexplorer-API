const path = require('path');
const multer = require('multer');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');


const TMP_DIR = path.join(__dirname, '..', '..', 'tmp');

// create folder if not exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

const UPLOADS_DIR = path.join(TMP_DIR, 'uploads');

// create folder if not exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_DIR,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_DIR,
  UPLOADS_DIR,
  MULTER,
};