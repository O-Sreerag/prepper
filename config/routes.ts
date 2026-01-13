export const ROUTES = {
  DASHBOARD: "/",
  TEST_PAPERS: {
    ROOT: "/test-papers",
    CREATE: "/test-papers/create",
    VIEW: (id: string) => `/test-papers/${id}`,
  },
  MOCK_TESTS: "/tests",
  FLASHCARDS: "/flashcards",
  ANALYTICS: "/analytics",
  GOALS: "/goals",
  PLANNER: "/planner",
  AI_TUTOR: "/tutor",
} as const