// const express = require('express')
// const router = express.Router();
// const authController = require('../controllers/authController');

// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   })
  
//   const upload = multer({ storage: storage })


// router.post('/signup', upload.single("profileImage"), authController.signup)
// router.post('/login', authController.login)

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single("profileImage"), authController.signup);
router.post('/login', authController.login);

module.exports = router;
