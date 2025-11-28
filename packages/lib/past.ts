const { prisma } = require("@repo/db/client");

async function addHistory(userId, data) {
  return prisma.history.create({
    data: {
      url: data.url,
      prompt: data.prompt,
      modelName: data.modelName,
      userId,
    },
  });
}

async function getUserHistory(userId) {
  return prisma.history.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function deleteHistory(id) {
  return prisma.history.delete({
    where: { id },
  });
}

module.exports = {
  addHistory,
  getUserHistory,
  deleteHistory,
};

