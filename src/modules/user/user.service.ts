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

export async function updateUserProfile(userId: string, data: { bio?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
    },
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