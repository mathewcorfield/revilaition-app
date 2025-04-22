// Define the structure of the response data
interface OpenAIResponse {
  response: string;
}

// Define the service function to send the prompt
export class OpenAIService {
  static async sendPrompt(prompt: string): Promise<string> {
    const apiUrl = "https://gptchat-c49x.onrender.com/api/chat";
    
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      // Ensure the response is OK before parsing
      if (!res.ok) {
        throw new Error("Failed to fetch data from the API.");
      }

      const data: OpenAIResponse = await res.json();
      return data.response; // Return the response from the OpenAI API
    } catch (err) {
      console.error(err);
      throw new Error("Error getting response from OpenAI.");
    }
  }
}
