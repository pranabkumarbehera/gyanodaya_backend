const { StatusCodes } = require("http-status-codes");
const MockTest = require("../models/MockTest");
const Question = require("../models/Question");
const Result = require("../models/Result");
const TestSession = require("../models/TestSession");
const ApiError = require("../utils/api-error");
const ApiFeatures = require("../utils/api-features");
const { calculateScore } = require("../utils/mock-test");

class MockTestService {
  async list(queryString) {
    const features = new ApiFeatures(MockTest.find(), queryString)
      .search(["title", "subject", "category"])
      .filter(["subject", "difficulty", "premiumStatus", "category", "featured", "recent"])
      .sort("-createdAt")
      .paginate();

    const tests = await features.query;
    return { data: tests, pagination: features.pagination };
  }

  freeTests() {
    return MockTest.find({ premiumStatus: false }).sort({ createdAt: -1 });
  }

  premiumTests() {
    return MockTest.find({ premiumStatus: true }).sort({ createdAt: -1 });
  }

  categories() {
    return MockTest.distinct("category");
  }

  async details(id) {
    const mockTest = await MockTest.findById(id);
    if (!mockTest) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Mock test not found");
    }
    return mockTest;
  }

  async startTest(user, mockTestId) {
    const mockTest = await this.details(mockTestId);
    const activeSession = await TestSession.findOne({
      user: user._id,
      mockTest: mockTestId,
      status: "in_progress"
    });

    if (activeSession) {
      return activeSession;
    }

    return TestSession.create({
      user: user._id,
      mockTest: mockTest._id,
      expiresAt: new Date(Date.now() + mockTest.duration * 60 * 1000)
    });
  }

  async getQuestions(mockTestId) {
    await this.details(mockTestId);
    const questions = await Question.find({ mockTest: mockTestId }).sort({ order: 1 }).lean();
    return questions.map((question) => ({
      ...question,
      correctAnswers: undefined
    }));
  }

  async saveAnswer(userId, sessionId, answer) {
    const session = await TestSession.findOne({ _id: sessionId, user: userId, status: "in_progress" });
    if (!session) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Active test session not found");
    }

    const existingIndex = session.answers.findIndex(
      (item) => String(item.questionId) === String(answer.questionId)
    );

    if (existingIndex === -1) {
      session.answers.push(answer);
    } else {
      session.answers[existingIndex] = answer;
    }

    await session.save();
    return session;
  }

  async timer(userId, sessionId) {
    const session = await TestSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Session not found");
    }

    const remainingMs = Math.max(new Date(session.expiresAt).getTime() - Date.now(), 0);
    return {
      sessionId: session._id,
      remainingSeconds: Math.floor(remainingMs / 1000)
    };
  }

  async palette(userId, sessionId) {
    const session = await TestSession.findOne({ _id: sessionId, user: userId });
    if (!session) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Session not found");
    }

    const questions = await Question.find({ mockTest: session.mockTest }).sort({ order: 1 });
    return questions.map((question, index) => {
      const answer = session.answers.find((item) => String(item.questionId) === String(question._id));
      return {
        index: index + 1,
        questionId: question._id,
        status: answer && answer.selectedOptions.length ? "answered" : "unanswered"
      };
    });
  }

  async submit(user, sessionId) {
    const session = await TestSession.findOne({ _id: sessionId, user: user._id, status: "in_progress" });
    if (!session) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Active session not found");
    }

    const questions = await Question.find({ mockTest: session.mockTest });
    const scoreCard = calculateScore({ questions, answers: session.answers });
    session.status = "submitted";
    await session.save();

    const subjectMap = {};
    questions.forEach((question) => {
      const answer = session.answers.find((item) => String(item.questionId) === String(question._id));
      if (!subjectMap[question.subject]) {
        subjectMap[question.subject] = { subject: question.subject, attempted: 0, correct: 0 };
      }
      if (answer && answer.selectedOptions.length) {
        subjectMap[question.subject].attempted += 1;
        const normalized = [...answer.selectedOptions].sort().join(",");
        const correct = [...question.correctAnswers].sort().join(",");
        if (normalized === correct) {
          subjectMap[question.subject].correct += 1;
        }
      }
    });

    const subjectPerformance = Object.values(subjectMap).map((item) => ({
      ...item,
      accuracy: item.attempted ? Number(((item.correct / item.attempted) * 100).toFixed(2)) : 0
    }));

    const weakTopics = questions
      .filter((question) => {
        const answer = session.answers.find((item) => String(item.questionId) === String(question._id));
        if (!answer || !answer.selectedOptions.length) {
          return true;
        }
        return [...answer.selectedOptions].sort().join(",") !== [...question.correctAnswers].sort().join(",");
      })
      .slice(0, 5)
      .map((question) => ({
        subject: question.subject,
        topic: question.topic,
        accuracy: 0
      }));

    const result = await Result.create({
      user: user._id,
      mockTest: session.mockTest,
      session: session._id,
      ...scoreCard,
      subjectPerformance,
      weakTopics
    });

    user.statistics.testsAttempted += 1;
    user.statistics.questionsAttempted += session.answers.length;
    user.statistics.correctAnswers += scoreCard.correctCount;
    user.statistics.points += Math.max(scoreCard.score, 0);
    user.statistics.accuracyPercentage = scoreCard.accuracy;
    user.performanceAnalytics.progressChart.push({
      label: new Date().toLocaleDateString("en-IN"),
      score: scoreCard.score,
      attemptedAt: new Date()
    });
    user.performanceAnalytics.subjectPerformance = subjectPerformance.map((item) => ({
      subject: item.subject,
      accuracy: item.accuracy,
      averageScore: item.correct
    }));
    user.performanceAnalytics.weakTopics = weakTopics;
    await user.save();

    const totalSubmitted = await Result.countDocuments({ mockTest: session.mockTest });
    result.rank = totalSubmitted;
    result.leaderboardPercentile = totalSubmitted <= 1 ? 100 : Number((((totalSubmitted - result.rank) / totalSubmitted) * 100).toFixed(2));
    await result.save();

    return result;
  }
}

module.exports = new MockTestService();
