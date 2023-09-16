export const categories = [
   'ARCHITECTURE',
   'ART',
   'BIBLES',
   'BIOGRAPHY & AUTOBIOGRAPHY',
   'BUSINESS & ECONOMICS',
   'COOKING',
   'COMPUTERS',
   'CRAFTS & HOBBIES',
   'DESIGN',
   'DRAMA',
   'EDUCATION',
   'FAMILY & RELATIONSHIPS',
   'FICTION',
   'GARDENING',
   'HEALTH & FITNESS',
   'HISTORY',
   'HUMOR',
   'LANGUAGE ARTS & DISCIPLINES',
   'LAW',
   'MATHEMATICS',
   'MEDICAL',
   'MUSIC',
   'NATURE',
   'PHILOSOPHY',
   'POETRY',
   'POLITICAL SCIENCE',
   'PSYCHOLOGY',
   'RELIGION',
   'SCIENCE',
   'SELF-HELP',
   'SOCIAL SCIENCE',
   'SPORTS & RECREATION',
   'TECHNOLOGY & ENGINEERING',
   'TRUE CRIME',
   'YOUNG ADULT FICTION',
] as const;

export const serverSideCategories = ['HISTORY', 'SELF-HELP'];

// testing here with top categories:
export const topCategories = [
   'BIOGRAPHY & AUTOBIOGRAPHY',
   'BUSINESS & ECONOMICS',
   'PHILOSOPHY',
   'COMPUTERS',
   'POETRY',
   'RELIGION',
   'SCIENCE',
   'TECHNOLOGY & ENGINEERING',
];

export type ServerSideCategories = (typeof serverSideCategories)[keyof typeof serverSideCategories];
export type Categories = (typeof categories)[keyof typeof categories];
export type TopCateogry = (typeof topCategories)[number];
