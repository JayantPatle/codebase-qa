const mongoose = require("mongoose");
const Chunk = require("../models/Chunk");

exports.getStatus = async (req, res, next) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const geminiKey = !!process.env.GEMINI_API_KEY;
    
    let dbConnection = "Disconnected";
    if (dbStatus === 0) dbConnection = "Disconnected";
    else if (dbStatus === 1) dbConnection = "Connected";
    else if (dbStatus === 2) dbConnection = "Connecting";
    else if (dbStatus === 3) dbConnection = "Disconnecting";

    const totalChunks = await Chunk.countDocuments();
    const totalRepos = await Chunk.distinct("repoName");

    res.json({
      backend: "OK",
      database: dbConnection,
      databaseStatus: dbStatus,
      llm: geminiKey ? "Configured" : "Missing",
      stats: {
        totalChunks,
        totalRepositories: totalRepos.length
      }
    });
  } catch (err) {
    next(err);
  }
};