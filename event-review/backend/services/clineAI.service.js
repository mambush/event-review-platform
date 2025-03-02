const axios = require('axios');

class ClineAIService {
  constructor() {
    this.apiKey = process.env.CLINE_AI_API_KEY;
    this.baseURL = 'https://api.clineai.com/v1'; // Replace with actual Cline AI API URL
  }
  
  // Get personalized event recommendations
  async getRecommendations(userId, preferences) {
    try {
      const response = await axios.post(
        `${this.baseURL}/recommendations`,
        { userId, preferences },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Cline AI recommendations error:', error);
      return { recommendations: [], error: true };
    }
  }
  
  // Enhanced sentiment analysis
  async enhancedSentimentAnalysis(reviewText) {
    try {
      const response = await axios.post(
        `${this.baseURL}/enhanced-sentiment`,
        { text: reviewText },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Cline AI enhanced sentiment analysis error:', error);
      return { 
        sentiment: 'neutral', 
        score: 0, 
        aspects: [], 
        error: true 
      };
    }
  }
  
  // User behavior analysis
  async analyzeUserBehavior(userData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/user-behavior`,
        { userData },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Cline AI user behavior analysis error:', error);
      return { 
        patterns: [], 
        preferences: {}, 
        error: true 
      };
    }
  }
}

module.exports = new ClineAIService();