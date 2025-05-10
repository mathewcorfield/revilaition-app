import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useState } from "react";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {getSignedURL} from "@/services/dataService"; 

interface PDFViewerProps {
  subject_id?: string;
  examboard_id?: string;
  level_id?: string;
  type?: string;
  year?: string;
}

export const PDFViewer = ({
  subject_id,
  examboard_id,
  level_id,
  type,
  year,
}: PDFViewerProps) => {
const [pdfUrl, setPdfUrl] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const linkExpiry = 3600;
const url = 'biology/wjec/alevel/markschemes/2022/2022 Biology WJEC A Unit 3 MS.pdf';

  useEffect(() => {
    const fetchPdfUrl = async () => {
    const pdfUrl = await getSignedURL(url, linkExpiry);
    setPdfUrl(pdfUrl);
    setLoading(false);
    };

    fetchPdfUrl();
  }, [subject_id, examboard_id, level_id, type, year]);

  return (
    <div className="pdf-viewer">
      {pdfUrl ? (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js`}>
          <Document file={pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        </Worker>
      ) : (
        <div>No PDF found for this selection.</div>
      )}
    </div>
  );
};
