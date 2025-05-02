export const calculateProgress = (subject: Subject, key: "learnt" | "revised") => {
  const totalSubtopics = subject.subtopics.length;
  if (totalSubtopics === 0) return 0;

  const count = subject.subtopics.reduce(
    (sum, subtopic) => sum + (subtopic[key] > 0 ? 1 : 0),
    0
  );
  return Math.round((count / totalSubtopics) * 100);
};
