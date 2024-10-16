const validator = require("validator");
const UserRepository = require("../repository/user.repository");
const userRepo = new UserRepository();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: error.message || "Missing credentials",
        error: error,
      });
    }
    const result = await userRepo.validateUserForLogin(email, password);
    if (!result)
      return res.status(401).json({ message: "Invalid credentials" });
    return res
      .status(200)
      .cookie("token", result.token, { httpOnly: true })
      .json({
        message: "Login successful",
        user: result.user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error while logging you in",
      error: error,
    });
  }
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body;
  const missingFields = [
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
  ].some((field) => !field || field.trim === "");
  if (missingFields) {
    return res
      .status(401)
      .json({ error: "All fields are required and cannot be empty" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Your email is not a valid email." });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: "Please enter a strong password." });
  }
  if (age > 99 || age < 18) {
    return res
      .status(400)
      .json({ error: "Sorry! your age doesn't match our criteria" });
  }
  try {
    const user = await userRepo.createUser({
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
    });
    if (user) {
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error while creating a user",
      error: error,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while logging you out",
      error: error,
    });
  }
};

module.exports = {
  login,
  signup,
  logout,
};
