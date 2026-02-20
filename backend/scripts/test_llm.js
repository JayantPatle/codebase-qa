require('dotenv').config({ path: __dirname + '/../.env' });

const { askLLM } = require('../src/services/llm.service');

(async () => {
  try {
    const res = await askLLM('What is 2+2?', '');
    console.log('LLM Response:', res);
  } catch (err) {
    console.error('LLM Test Error:', err);
  }
})();
