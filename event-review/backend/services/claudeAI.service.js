const axios = require('axios');

class ClaudeAIService {
  constructor() {
    this.apiKey = process.env.CLAUDE_AI_API_KEY;
    this.baseURL = 'https://api.claude.ai/v1'; // Replace with actual Claude API URL
  }
  
  // Analyze sentiment of a review
  async analyzeSentiment(text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sentiment-analysis`,
        { text },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Claude AI sentiment analysis error:', error);
      return { score: 0, error: true };
    }
  }
  
  // Summarize a review
  async summarizeReview(text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/summarize`,
        { text, max_length: 100 },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Claude AI summarization error:', error);
      return { summary: '', error: true };
    }
  }
  
  // Extract insights from reviews
  async extractInsights(reviews) {
    try {
      const response = await axios.post(
        `${this.baseURL}/extract-insights`,
        { reviews },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Claude AI insights extraction error:', error);
      return { insights: [], error: true };
    }
  }
}

module.exports = new ClaudeAIService();