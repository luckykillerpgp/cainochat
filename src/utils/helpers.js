// Mock contacts for demo
export const MOCK_CONTACTS = [
  {
    id: 'user_abc123',
    name: 'Emma de Vries',
    phone: '+31612345678',
    avatar: '👩‍💼',
    status: 'online',
    verified: true,
  },
  {
    id: 'user_def456',
    name: 'Jayden Bakker',
    phone: '+31623456789',
    avatar: '👨‍💻',
    status: 'online',
    verified: false,
  },
  {
    id: 'user_ghi789',
    name: 'Sophie Jansen',
    phone: '+31634567890',
    avatar: '👩‍🎨',
    status: 'offline',
    verified: true,
  },
  {
    id: 'user_jkl012',
    name: 'Daan Visser',
    phone: '+31645678901',
    avatar: '🧑‍🚀',
    status: 'online',
    verified: false,
  },
  {
    id: 'user_mno345',
    name: 'Lotte Mulder',
    phone: '+31656789012',
    avatar: '👩‍🔬',
    status: 'away',
    verified: true,
  },
];

// Mock call history
export const MOCK_CALL_HISTORY = [
  {
    id: 'call_1',
    contact: MOCK_CONTACTS[0],
    type: 'video',
    direction: 'outgoing',
    duration: '5:23',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'call_2',
    contact: MOCK_CONTACTS[1],
    type: 'audio',
    direction: 'incoming',
    duration: '12:07',
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'call_3',
    contact: MOCK_CONTACTS[2],
    type: 'video',
    direction: 'missed',
    duration: null,
    timestamp: Date.now() - 14400000,
  },
];

// Format timestamp to readable string
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Generate a room ID for a call between two users
export function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

// Tier limits
export const TIER_LIMITS = {
  free: {
    maxCallDuration: 30 * 60, // 30 minutes in seconds
    maxParticipants: 2,
    screenShare: false,
    hdQuality: false,
    label: 'Free',
  },
  paid: {
    maxCallDuration: Infinity,
    maxParticipants: 10,
    screenShare: true,
    hdQuality: true,
    label: 'Premium',
  },
};
