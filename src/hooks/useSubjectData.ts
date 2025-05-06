import { useEffect, useState } from "react";

export function useSubjectData(user, id, loading) {
  const [subject, setSubject] = useState(null);
  const [subtopics, setSubtopics] = useState([]);

  useEffect(() => {
    if (!loading && user?.subjects && id) {
      const foundSubject  = user.subjects.find((s) => String(s.id) === String(id));
      if (foundSubject ) {
        setSubtopics(foundSubject.subtopics);
        setSubject(foundSubject);
      }
    }
  }, [user, id, loading]);

  return { subject, subtopics, setSubject, setSubtopics };
}
