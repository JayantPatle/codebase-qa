const CodeChunk = require("../models/Chunk");

function scoreChunk(chunkContent, question) {
  const questionWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let score = 0;
  const contentLower = chunkContent.toLowerCase();

  // Exact phrase match (high priority)
  if (contentLower.includes(question.toLowerCase())) {
    score += 10;
  }

  // Word matches
  for (const word of questionWords) {
    const wordCount = (contentLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
    score += wordCount * 2;
  }

  // Function/class definition indicators
  if (contentLower.includes('function') || contentLower.includes('class') || 
      contentLower.includes('const') || contentLower.includes('export')) {
    score += 1;
  }

  return score;
}

exports.retrieveRelevantChunks = async (question, repoName) => {
  try {
    const chunks = await CodeChunk.find({ repoName });

    if (!chunks.length) {
      return [];
    }

    const scoredChunks = chunks.map(chunk => ({
      ...chunk.toObject(),
      score: scoreChunk(chunk.content, question)
    }));

    // Return top 5 chunks with score > 0, or top 3 even if score is low
    const sorted = scoredChunks
      .filter(chunk => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (sorted.length === 0) {
      // Fallback: return top 3 by any score
      return scoredChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    }

    return sorted;
  } catch (err) {
    console.error("Error in retrieveRelevantChunks:", err);
    throw err;
  }
};