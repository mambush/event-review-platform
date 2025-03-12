
// config/app.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development',
  claudeAIKey: process.env.CLAUDE_AI_KEY,
  boltDevKey: process.env.BOLT_DEV_KEY,
  clineAIKey: process.env.CLINE_AI_KEY,
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000'
};