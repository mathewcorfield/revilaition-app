import { useState, useEffect } from "react";
import { getAllSubjectNames } from "@/services/dataService";

const useSubjects = () => {
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const subcached = sessionStorage.getItem("allSubjects");
    if (subcached) {
      setAllSubjects(JSON.parse(subcached));
      setLoadingSubjects(false);
    } else {
      getAllSubjectNames().then((data) => {
        setAllSubjects(data);
        sessionStorage.setItem("allSubjects", JSON.stringify(data));
        setLoadingSubjects(false);
      });
    }
  }, []);

  return {
    allSubjects,
    loadingSubjects
  };
};

export default useSubjects;
