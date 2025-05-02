import { useState, useEffect } from "react";
import { getAllExamBoards } from "@/services/dataService";

const useExamBoards = () => {
  const [allExamBoards, setAllExamBoards] = useState<any[]>([]);
  const [loadingExamBoards, setLoadingExamBoards] = useState(true);

  useEffect(() => {
    const examcached = sessionStorage.getItem("allExamBoards");
    if (examcached) {
      setAllExamBoards(JSON.parse(examcached));
      setLoadingExamBoards(false);
    } else {
      getAllExamBoards().then((data) => {
        setAllExamBoards(data);
        sessionStorage.setItem("allExamBoards", JSON.stringify(data));
        setLoadingExamBoards(false);
      });
    }
  }, []);

  return {
    allExamBoards,
    loadingExamBoards
  };
};

export default useExamBoards;
