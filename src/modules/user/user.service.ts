import { prisma } from "../../lib/prisma.js";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      isOnline: true,
      lastSeen: true,
    },
  });

  return user;
}