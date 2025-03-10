import { aiAPI1 } from "@/config/envConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function AskAIModel(prompt: string) {
  const genAI = new GoogleGenerativeAI(aiAPI1());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const generationConfig = {
  //   temperature: 1,
  //   topP: 0.95,
  //   topK: 64,
  //   maxOutputTokens: 8192,
  //   responseMimeType: "application/json",
  // };

  // const chatSection = model.startChat({
  //   generationConfig,
  // });

  const result = await model.generateContent(`${prompt}`);

  const responseText = result.response.text();

  if (responseText) {
    try {
      console.log("Jons: ", responseText);
      return responseText;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  } else {
    console.error("No valid JSON found in the response.");
    return null;
  }
}

export default AskAIModel;
