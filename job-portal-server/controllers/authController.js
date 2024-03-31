const bcrypt = require("bcrypt");
// const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");


const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// exports.signup = async (req, res) => {
//   try {
//     const { email, password, firstName, lastName } = req.body;

//     console.log("details:", email, password, firstName, lastName)

//     const profileImage = req.file;

//     console.log("Image", profileImage);

//     if (!profileImage) {
//       return res.status(400).send("No file Uploaded");
//     }
//     const profileImagePath = profileImage.path;
//     // console.log(password);
//     const existingUser = await User.find({ email });

//     console.log("User", existingUser);

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // const user = new User({ email, password: hashedPassword });

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       profileImagePath,
//     });

//     await newUser.save();
//     const accessToken = generateAccessToken(newUser._id);
//     res.status(201).json({ accessToken, message: "User created success" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create User" });
//   }
// };


exports.signup = async (req, res) => {
  try {
      const { email, password, firstName, lastName } = req.body;
      const profileImage = req.file;

      if (!profileImage) {
          return res.status(400).send("No file Uploaded");
      }

      const profileImagePath = profileImage.path;

      const existingUser = await User.findOne({ email }).maxTimeMS(30000);

      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt.hash to hash the password

      const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          profileImagePath,
      });

      await newUser.save();

      const accessToken = generateAccessToken(newUser._id);
      res.status(201).json({ accessToken, message: "User created success" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create User" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res.status(401).json({ message: "Invalid pass" });
    }
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
};

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const multer = require("multer");

// const generateAccessToken = (userId) => {
//     return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1h'});
// }

// exports.signup = async (req, res) => {
//   try {
//     const { email, password, firstName, lastName } = req.body;
//     const profileImage = req.file;
//     if (!profileImage){
//       return res.status(400).send("No file uploaded");
//     }
//     const profileImagePath = profileImage.path;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       firstName, lastName, email, password: hashedPassword, profileImagePath
//     });

//     await newUser.save();
//     const accessToken = generateAccessToken(newUser._id);
//     res.status(201).json({ accessToken, message: "User created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create user" });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const isValidPass = await bcrypt.compare(password, user.password);
//     if (!isValidPass) {
//       return res.status(401).json({ message: "Invalid password" });
//     }
//     const accessToken = generateAccessToken(user._id);

//     res.status(200).json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to login" });
//   }
// };
