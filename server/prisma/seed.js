import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  const quiz = await prisma.quiz.create({
    data: {
      title: "General Knowledge 101",
      questions: {
        create: [
          {
            text: "Which planet is known as the Red Planet?",
            type: "MCQ",
            order: 0,
            options: {
              create: [
                { text: "Earth", isCorrect: false },
                { text: "Mars", isCorrect: true },
                { text: "Jupiter", isCorrect: false },
                { text: "Venus", isCorrect: false }
              ]
            }
          },
          {
            text: "The sun rises in the West.",
            type: "TRUE_FALSE",
            order: 1,
            correct: false
          },
          {
            text: "What is the chemical symbol for water?",
            type: "SHORT_TEXT",
            order: 2,
            answerKey: "H2O"
          }
        ]
      }
    }
  });

  console.log("Seeded quiz with id:", quiz.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
