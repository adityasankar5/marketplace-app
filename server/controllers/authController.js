const bcrypt = require("bcryptjs");
const base = require("../config/airtable");
const { generateToken } = require("../config/auth");

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, roles } = req.body;

      // Validate input
      if (!username || !email || !password || !roles) {
        return res.status(400).json({
          error: "Missing required fields",
        });
      }

      // Check if user exists
      const existingUsers = await base("Users")
        .select({
          filterByFormula: `OR(email = '${email}', username = '${username}')`,
        })
        .firstPage();

      if (existingUsers.length > 0) {
        return res.status(400).json({
          error: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Format date for Airtable (YYYY-MM-DD)
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      // Create user
      const record = await base("Users").create([
        {
          fields: {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            roles: roles,
            createdAt: formattedDate,
          },
        },
      ]);

      const user = record[0];
      const userData = {
        id: user.id,
        email: user.fields.email,
        username: user.fields.username,
        roles: user.fields.roles,
      };

      // Generate token
      const token = generateToken(userData);

      res.status(201).json({
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Error registering user",
        details: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const records = await base("Users")
        .select({
          filterByFormula: `email = '${email}'`,
        })
        .firstPage();

      if (records.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const user = records[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        user.fields.password
      );

      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const userData = {
        id: user.id,
        email: user.fields.email,
        username: user.fields.username,
        roles: user.fields.roles,
      };

      // Generate token
      const token = generateToken(userData);

      res.json({
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Error logging in",
        details: error.message,
      });
    }
  },
};

module.exports = authController;
