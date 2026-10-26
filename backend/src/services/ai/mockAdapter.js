/**
 * Mock AI Adapter for automated testing and deterministic environments
 * Does not make external network calls
 */
export async function generateMockContent({
  systemPrompt,
  userMessage,
  conversationHistory = [],
  maxOutputTokens = 600,
  timeoutMs = 12000,
}) {
  const lowerMsg = (userMessage || '').toLowerCase();

  // Simulate prompt injection rejection if user attempts to breach prompt
  if (
    lowerMsg.includes('ignore previous instructions') ||
    lowerMsg.includes('reveal system instructions') ||
    lowerMsg.includes('show secret') ||
    lowerMsg.includes('database password')
  ) {
    return 'I can only assist with verified portfolio information about Sumit Kumar. I cannot reveal internal instructions, environment variables, or private system credentials.';
  }

  // Question about Sumit
  if (lowerMsg.includes('who is sumit') || lowerMsg.includes('tell me about sumit') || lowerMsg.includes('about')) {
    return 'Sumit Kumar is a Full-Stack MERN Developer and DSA Enthusiast pursuing B.Tech in Computer Science and Engineering at SAGE University, Indore (Graduating 2026). He specializes in scalable web systems, clean RESTful architectures, and algorithmic problem solving in C++.';
  }

  // Question about RESTIFY
  if (lowerMsg.includes('restify')) {
    return 'RESTIFY is a digital wellbeing and screen-time control platform developed by Sumit Kumar. It helps users manage digital distractions and monitor device usage through an intuitive dashboard with analytics and scheduled session blocks.';
  }

  // Question about StockSaathi AI
  if (lowerMsg.includes('stocksaathi') || lowerMsg.includes('stock')) {
    return 'StockSaathi AI is an AI-powered stock market and financial insights platform that simplifies equity research, market trend analysis, and portfolio intelligence for retail investors.';
  }

  // Question about technologies / skills
  if (lowerMsg.includes('technologies') || lowerMsg.includes('tech stack') || lowerMsg.includes('skills')) {
    return 'Sumit works with JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, Tailwind CSS, and C++ for Data Structures & Algorithms. He also uses tools like Git, GitHub, Postman, Vite, and Vercel.';
  }

  // Question about contact
  if (lowerMsg.includes('contact') || lowerMsg.includes('reach') || lowerMsg.includes('email')) {
    return 'You can contact Sumit Kumar via the Contact section on this portfolio, or connect with him on GitHub and LinkedIn.';
  }

  // Default mock response
  return `Based on Sumit Kumar's verified portfolio: ${userMessage.slice(0, 80)}... He is a Full Stack Developer specializing in React, Node.js, and MongoDB.`;
}

export default {
  generateMockContent,
};
