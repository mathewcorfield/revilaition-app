// Define the structure of the OpenAI response
interface OpenAIResponse {
  response: string;
}

// The function to get a revision question
export const getRevisionQuestion = async (subject: string, examboard: string, level: string): Promise<string> => {
  const apiUrl = "https://gptchat-c49x.onrender.com/api/chat";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Ask me an example exam question for ${subject} at ${level} standard for ${examboard} exam board to help me revise with good exam technique for an upcoming exam`,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data: OpenAIResponse = await res.json();
    return data.response;
  } catch (err) {
    console.error(err);
    throw new Error("Error getting revision question.");
  }
};

// The function to evaluate an answer
export const evaluateAnswer = async (answer: string, question: string, examboard: string, level: string): Promise<string> => {
  const apiUrl = "https://gptchat-c49x.onrender.com/api/chat";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Evaluate the answer "${answer}" at ${level} standard for ${examboard} exam board against the mark scheme. This was the exam question: "${question}". Include feedback on where the answer could be improved, factoring in that I need to use good exam techniques.`,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data: OpenAIResponse = await res.json();
    return data.response;
  } catch (err) {
    console.error(err);
    throw new Error("Error getting answer evaluation.");
  }
};

// Export any other functions if needed
export const sendPrompt = async (prompt: string): Promise<string> => {
  // Placeholder for other prompts if needed
  const apiUrl = "https://gptchat-c49x.onrender.com/api/chat";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data: OpenAIResponse = await res.json();
    return data.response;
  } catch (err) {
    console.error(err);
    throw new Error("Error sending prompt.");
  }
};
