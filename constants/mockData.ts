export const currentUser = {
  name: 'Sam',
  connectionsCount: 142,
  eventsCount: 12,
};

export const recentConnections = [
  {
    id: '1',
    name: 'David Chen',
    role: 'Product Designer',
    company: 'Vercel',
    category: 'Design',
    timeAgo: '2h ago',
    initials: 'DC',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Founder',
    company: 'EcoStart',
    category: 'Startup',
    timeAgo: 'Yesterday',
    initials: 'SJ',
  },
  {
    id: '3',
    name: 'Marcus Adebayo',
    role: 'VP Engineering',
    company: 'Stripe',
    category: 'Fintech',
    timeAgo: 'Oct 12',
    initials: 'MA',
  },
];

export const weeklyMet = [
  { id: '1', name: 'David', initials: 'DA' },
  { id: '2', name: 'Sarah', initials: 'SA' },
  { id: '3', name: 'Marcus', initials: 'MA' },
  { id: '4', name: 'Elena', initials: 'EL' },
  { id: '5', name: 'Tom', initials: 'TO' },
];

export const mockProfile = {
  name: 'Sarah Jenkins',
  title: 'Product Lead @ TechFlow',
  metAt: "Tech Innovators Summit '23, Cape Town",
  date: 'Oct 12, 2023',
  notes:
    "Discussed the future of AI in networking. She's looking for a co-founder for a side project. Very energetic and detail-oriented.",
  hashtags: ['founder', 'tech', 'ai-enthusiast'],
  peopleLike: [
    { name: 'David K.', role: 'Founder' },
    { name: 'Emily R.', role: 'Product' },
    { name: 'Marc T.', role: 'Design Leader' },
  ],
};

export const categoryColors: Record<string, { bg: string; text: string }> = {
  Design: { bg: '#EDE9FE', text: '#6D28D9' },
  Startup: { bg: '#D1FAE5', text: '#065F46' },
  Fintech: { bg: '#DBEAFE', text: '#1D4ED8' },
  Events: { bg: '#FEF3C7', text: '#92400E' },
  Content: { bg: '#FCE7F3', text: '#9D174D' },
};
