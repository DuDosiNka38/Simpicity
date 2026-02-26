require("dotenv").config();
const db = require("../database/db_index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");

const generateJWT = (id, email) => {
  return jwt.sign({email}, process.env.SECRET_KEY, {subject: String(id), expiresIn: process.env.JWT_EXPIRES_IN || "24h"}
  );
};

class UserController {


    // registration
  async registration(request, response) {
    const {name, email, password} = request.body;

    console.log(request.body);

    if (!name || !email || !password) {
      return errorResponse(response, 400, "Validation failed", {
        fields: ["name, email and password are requestuired"]
      });
    }

    const candidate = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

    if (candidate) {
      return errorResponse(response, 400, "Validation failed", {email: ["User already exists"]});
    }

    const hashPassword = bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

    const result = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(name, email, hashPassword);

    const token = generateJWT(result.lastInsertRowid, email);

    return successResponse(response, 201, {token}, "User registered successfully");
  }


  // login
  async login(request,response) {
    const {email, password} = request.body;

    if (!email || !password) {
      return errorResponse(response, 400, "Validation failed");
    }

    const user = db.prepare("SELECT id, email, password_hash FROM users WHERE email = ?").get(email);

    if (!user) {
      return errorResponse(response, 401, "Invalid email or password");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(response, 401, "Invalid email or password");
    }

    const token = generateJWT(user.id, user.email);

    return successResponse(response, 200, {token}, "Login successful");
  }


}

module.exports = new UserController();
