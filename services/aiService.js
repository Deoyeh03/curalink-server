// AI Service - Core intellectual property of CuraLink
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"}); // Updated to gemini-2.5-flash


const extractConditions = async (naturalLanguageText) => {
  try {
    const prompt = `Extract medical conditions or keywords from the following text: ${naturalLanguageText}. Return only a JSON array of strings, with no additional text or markdown formatting.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error extracting conditions:", error);
    return [];
  }
};

const generateSummary = async (fullAbstract, targetAudience) => {
  try {
    let prompt;
    if (targetAudience === "Patient-friendly") {
      prompt = `Summarize the following medical text in simple, patient-friendly language, focusing on the impact and key takeaways: ${fullAbstract}.`;
    } else if (targetAudience === "Researcher-focused") {
      prompt = `Summarize the following medical text in a technical, researcher-focused manner, highlighting methods, results, and significance: ${fullAbstract}.`;
    } else {
      prompt = `Summarize the following medical text: ${fullAbstract}.`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary.";
  }
};

module.exports = {
  extractConditions,
  generateSummary,
  // listModels, // Removed
};
