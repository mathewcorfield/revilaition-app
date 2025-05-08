export const parseQuestion = (questionText: string) => {
    // Regex to extract question name and marks
    const regex = /^(.*?)(?: \((\d+)\s*marks\))?$/;
  
    // Match the question with regex
    const match = questionText.match(regex);
  
    if (match) {
      const questionName = match[1].trim();  // The question text (without marks)
      const marks = match[2] ? parseInt(match[2], 10) : 0;  // Extract marks, default to 0 if not found
      
      return { questionName, marks };
    } else {
      throw new Error("Unable to parse question and marks");
    }
  };
