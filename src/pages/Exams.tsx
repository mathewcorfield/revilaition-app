import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PDFViewer } from "@/components/PDFViewer";

interface Paper {
  id: string;
  subject: string;
  examBoard: string;
  level: string;
  year: string;
  fileUrl: string;
}

const PapersPage = () => {
  const [subject, setSubject] = useState<string>("");
  const [examBoard, setExamBoard] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [papers, setPapers] = useState<Paper[]>([]);

  // Fetch available subjects, exam boards, levels, etc.
 
  return (
    <div className="p-4">
      <h1>Select Papers</h1>

      <div className="filters">
        <Select onChange={(e) => setSubject(e.target.value)} value={subject}>
          <Option value="">Select Subject</Option>
          <Option value="biology">Biology</Option>
          <Option value="chemistry">Chemistry</Option>
          <Option value="Economics">Economics</Option>
        </Select>

        <Select onChange={(e) => setExamBoard(e.target.value)} value={examBoard}>
          <Option value="">Select Exam Board</Option>
          <Option value="wjec">WJEC</Option>
          <Option value="edexcel">Edexcel</Option>
          <Option value="ocr">OCR</Option>
        </Select>

        <Select onChange={(e) => setLevel(e.target.value)} value={level}>
          <Option value="">Select Level</Option>
          <Option value="alevel">A-Level</Option>
          <Option value="gcse">GCSE</Option>
        </Select>

        <Select onChange={(e) => setYear(e.target.value)} value={year}>
          <Option value="">Select Year</Option>
          <Option value="2022">2022</Option>
          <Option value="2021">2021</Option>
          <Option value="2023">2023</Option>
        </Select>
      </div>

      <div className="papers-list">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper.id} className="paper-card">
              <h2>{paper.subject} - {paper.examBoard} - {paper.level} - {paper.year}</h2>
              <Button onClick={() => }>View Paper</Button>
            </div>
          ))
        ) : (
          <p>No papers found for selected filters.</p>
        )}
      </div>
      {<PDFViewer  />}
    </div>
  );
};

export default PapersPage;
