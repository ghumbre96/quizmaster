// src/services/quizService.js
import { prisma } from "../prisma.js";

/** Public: list quizzes (no answers) */
export async function listQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    createdAt: q.createdAt,
    questionCount: q._count.questions,
  }));
}

/** Public: get a quiz (no correct answers) */
export async function getQuizById(id) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" }, include: { options: true } } },
  });
  if (!quiz) return null;
  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.type === "MCQ" ? q.options.map(o => ({ id: o.id, text: o.text })) : [],
    })),
  };
}

/** Public: grade a submission */
export async function gradeQuiz(id, answers) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: { include: { options: true } } },
  });
  if (!quiz) return null;

  let score = 0;
  const total = quiz.questions.length;

  for (const q of quiz.questions) {
    const a = answers?.[q.id];
    if (q.type === "MCQ") {
      const ok = q.options.some(o => o.id === Number(a) && o.isCorrect);
      if (ok) score++;
    } else if (q.type === "TRUE_FALSE") {
      if (String(a) === String(q.correct)) score++;
    } else if (q.type === "SHORT_TEXT" && q.answerKey) {
      if (String(a || "").trim().toLowerCase() === q.answerKey.trim().toLowerCase()) score++;
    }
  }
  return { score, total };
}

/** Admin: create quiz */
export async function createQuiz(title, questions) {
  const data = {
    title,
    questions: {
      create: questions.map((q, i) => ({
        text: q.text,
        type: q.type,
        order: i,
        correct: q.type === "TRUE_FALSE" ? !!q.correct : null,
        answerKey: q.type === "SHORT_TEXT" ? (q.answerKey || null) : null,
        options:
          q.type === "MCQ"
            ? { create: q.options.map(o => ({ text: o.text, isCorrect: !!o.isCorrect })) }
            : undefined,
      })),
    },
  };
  return prisma.quiz.create({ data });
}

/** Admin: list quizzes (with counts) */
export async function listQuizzesForAdmin() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });
  return quizzes.map(q => ({
    id: q.id,
    title: q.title,
    createdAt: q.createdAt,
    questionCount: q._count.questions,
  }));
}

/** Admin: get full quiz (includes answers/options) */
export async function getQuizForAdmin(id) {
  return prisma.quiz.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" }, include: { options: true } } },
  });
}

/** Admin: update quiz (replace questions/options) */
export async function updateQuiz(id, title, questions) {
  return prisma.$transaction(async (tx) => {
    await tx.quiz.update({ where: { id }, data: { title } });
    await tx.option.deleteMany({ where: { question: { quizId: id } } });
    await tx.question.deleteMany({ where: { quizId: id } });

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const createdQ = await tx.question.create({
        data: {
          quizId: id,
          text: q.text,
          type: q.type,
          order: i,
          correct: q.type === "TRUE_FALSE" ? !!q.correct : null,
          answerKey: q.type === "SHORT_TEXT" ? (q.answerKey || null) : null,
        },
      });
      if (q.type === "MCQ" && Array.isArray(q.options) && q.options.length) {
        await tx.option.createMany({
          data: q.options.map(o => ({
            text: o.text,
            isCorrect: !!o.isCorrect,
            questionId: createdQ.id,
          })),
        });
      }
    }
    return { id };
  });
}

/** Admin: delete quiz */
export async function deleteQuiz(id) {
  await prisma.quiz.delete({ where: { id } });
  return { id };
}
