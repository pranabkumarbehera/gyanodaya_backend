const calculateScore = ({ questions, answers }) => {
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let score = 0;

  questions.forEach((question) => {
    const selected = answers.find((item) => item.questionId === String(question._id));
    const attempted = selected && Array.isArray(selected.selectedOptions) && selected.selectedOptions.length;

    if (!attempted) {
      unattemptedCount += 1;
      return;
    }

    const normalized = [...selected.selectedOptions].sort().join(",");
    const correct = [...question.correctAnswers].sort().join(",");

    if (normalized === correct) {
      correctCount += 1;
      score += question.positiveMarks;
      return;
    }

    incorrectCount += 1;
    score += question.negativeMarks;
  });

  const totalMarks = questions.reduce((sum, question) => sum + question.positiveMarks, 0);
  const accuracy = correctCount + incorrectCount === 0
    ? 0
    : Number(((correctCount / (correctCount + incorrectCount)) * 100).toFixed(2));

  return {
    score: Number(score.toFixed(2)),
    totalMarks,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy
  };
};

module.exports = { calculateScore };
