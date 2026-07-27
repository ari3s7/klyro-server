

type VoiceParticipant = {
  socketId: string;
  userId: string;
  username: string;
  avatar: string | null;
};

const voiceChannels = new Map<string, Map<string, VoiceParticipant>>();

export function addParticipant(channelId: string, participant: VoiceParticipant) {
  if (!voiceChannels.has(channelId)) {
    voiceChannels.set(channelId, new Map());
  }
  voiceChannels.get(channelId)!.set(participant.userId, participant);
}

export function removeParticipant(channelId: string, userId: string) {
  const channel = voiceChannels.get(channelId);
  if (!channel) return;
  channel.delete(userId);
  if (channel.size === 0) voiceChannels.delete(channelId);
}

export function getParticipants(channelId: string): VoiceParticipant[] {
  const channel = voiceChannels.get(channelId);
  return channel ? Array.from(channel.values()) : [];
}

export function removeSocketFromAllChannels(socketId: string) {
  const affected: { channelId: string; userId: string }[] = [];

  for (const [channelId, participants] of voiceChannels.entries()) {
    for (const [userId, p] of participants.entries()) {
      if (p.socketId === socketId) {
        participants.delete(userId);
        affected.push({ channelId, userId });
      }
    }
    if (participants.size === 0) voiceChannels.delete(channelId);
  }

  return affected;
}