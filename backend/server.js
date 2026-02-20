require("dotenv").config({ path: __dirname + "/.env" });

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
      console.log("Gemini Key Loaded:", !!process.env.GEMINI_API_KEY);
    });
  } catch (err) {
    console.error(err);
  }
})();