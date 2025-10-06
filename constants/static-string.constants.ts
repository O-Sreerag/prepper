export const FLASHCARD_STRINGS = {
  title: "Flashcards",
  description: "Spaced repetition learning with AI-powered cards",
  createDeck: "Create Deck",
  studyDue: "Study Due Cards",
  totalCards: "Total Cards",
  totalCardsDescription: "Across all decks",
  dueToday: "Due Today",
  dueTodayDescription: "Ready for review",
  mastered: "Mastered",
  masteredDescription: "Well learned",
  studyStreak: "Study Streak",
  studyStreakDescription: "Days in a row",
  yourDecks: "Your Decks",
};

export const CREATE_FLASHCARD_DIALOG_STRINGS = {
  title: "Create Flashcard Deck",
  description: "Create flashcards manually or let AI generate them from your content",
  manualCreation: "Manual Creation",
  aiGeneration: "AI Generation",
  deckTitle: "Deck Title",
  deckTitlePlaceholder: "e.g., Physics Formulas",
  subject: "Subject",
  selectSubject: "Select subject",
  addCards: "Add Cards",
  frontLabel: "Front (Question)",
  frontPlaceholder: "What is Newton's second law?",
  backLabel: "Back (Answer)",
  backPlaceholder: "F = ma (Force equals mass times acceleration)",
  addCard: "Add Card",
  cancel: "Cancel",
  createDeck: "Create Deck",
  aiDeckTitlePlaceholder: "e.g., Organic Chemistry Reactions",
  contentSource: "Content Source",
  contentSourcePlaceholder: "Paste your notes, textbook content, or any material you want to convert into flashcards...",
  numCards: "Number of Cards",
  selectNumCards: "Select count",
  difficulty: "Difficulty Level",
  selectDifficulty: "Select difficulty",
  generateWithAI: "Generate with AI",
  subjects: {
    physics: "Physics",
    chemistry: "Chemistry",
    mathematics: "Mathematics",
    biology: "Biology",
  },
  numCardOptions: {
    "10": "10 cards",
    "20": "20 cards",
    "30": "30 cards",
    "50": "50 cards",
  },
  difficultyOptions: {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  },
};

export const FLASHCARD_DECK_STRINGS = {
  cards: "cards",
  masteryProgress: "Mastery Progress",
  due: "Due:",
  last: "Last:",
  study: "Study",
};

export const GOALS_OVERVIEW_STRINGS = {
  title: "Goals & Targets",
  description: "Track your progress and stay motivated",
  createGoal: "Create Goal",
  activeGoals: "Active Goals",
  inProgress: "In progress",
  completed: "Completed",
  thisMonth: "This month",
  averageProgress: "Average Progress",
  acrossActiveGoals: "Across active goals",
  streak: "Streak",
  streakDescription: "Days achieving goals",
  progress: "Progress",
  hours: "hours",
  due: "Due:",
  viewDetails: "View Details",
  recentlyCompleted: "Recently Completed",
  completedOn: "Completed on",
};

export const CREATE_GOAL_DIALOG_STRINGS = {
  title: "Create New Goal",
  description: "Set a target to track your progress and stay motivated",
  goalTitle: "Goal Title",
  goalTitlePlaceholder: "e.g., Solve 150 Physics Questions",
  descriptionLabel: "Description",
  descriptionPlaceholder: "Add more details about your goal...",
  goalType: "Goal Type",
  selectType: "Select type",
  priority: "Priority",
  selectPriority: "Select priority",
  targetValue: "Target Value",
  targetValuePlaceholder: "e.g., 150",
  subject: "Subject",
  selectSubject: "Select subject",
  deadline: "Deadline",
  quickSuggestions: "Quick Suggestions",
  cancel: "Cancel",
  createGoal: "Create Goal",
  goalTypes: {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    custom: "Custom",
  },
  priorities: {
    high: "High",
    medium: "Medium",
    low: "Low",
  },
  subjects: {
    general: "General",
    physics: "Physics",
    chemistry: "Chemistry",
    mathematics: "Mathematics",
    biology: "Biology",
  },
  suggestions: {
    daily: ["Solve 20 questions", "Study for 2 hours", "Review 10 flashcards"],
    weekly: ["Complete 2 mock tests", "Solve 100 questions", "Study 15 hours"],
    monthly: ["Complete 8 mock tests", "Master a subject", "Solve 500 questions"],
  },
};

export const TEST_PAPERS_OVERVIEW_STRINGS = {
  title: "Test Papers",
  description: "Manage your uploaded test papers and track their processing status.",
  uploadNewPaper: "Upload New Paper",
  getStartedDescription: "Get started by uploading your first test paper.",
  noUploadJobsFound: "No upload jobs found",
  uploadedOn: "Uploaded on",
};

export const TESTS_OVERVIEW_STRINGS = {
  title: "Mock Tests",
  description: "Practice with real exam-like conditions",
  uploadNewTest: "Upload New Test",
  totalTests: "Total Tests",
  availableInLibrary: "Available in library",
  completed: "Completed",
  testsAttempted: "Tests attempted",
  averageScore: "Average Score",
  acrossAllAttempts: "Across all attempts",
  testLibrary: "Test Library",
};

export const TEST_CARD_STRINGS = {
  questions: "questions",
  min: "min",
  best: "Best:",
  lastAttempt: "Last attempt:",
  attempts: "attempts",
  startTest: "Start Test",
  studyMode: "Study Mode",
  notYetAttempted: "Not yet attempted",
};

export const DASHBOARD_STRINGS = {
  welcome: (name: string) => `Welcome back, ${name}!`,
  progressOverview: "Here's your study progress overview",
  startStudySession: "Start Study Session",
  questionsSolved: "Questions Solved",
  accuracyRate: "Accuracy Rate",
  studyHours: "Study Hours",
  mockTests: "Mock Tests",
};

export const EXAM_COUNTDOWN_STRINGS = {
  description: "Your target exam is approaching",
  daysLeft: "days left",
  preparationProgress: "Preparation Progress",
};

export const PERFORMANCE_CHART_STRINGS = {
  title: "Performance Trends",
  description: "Your accuracy and question-solving progress over time",
  accuracy: "Accuracy",
  questionsSolved: "Questions Solved",
};

export const RECENT_ACTIVITY_STRINGS = {
  title: "Recent Activity",
  description: "Your latest study sessions and achievements",
};

export const STUDY_STREAK_CARD_STRINGS = {
  title: "Study Streak",
  description: "Keep up the momentum!",
  currentStreak: "Current streak",
  bestStreak: "Best streak",
  mon: "Mon",
  sun: "Sun",
};

export const DASHBOARD_LAYOUT_STRINGS = {
  toggleSidebar: "Toggle sidebar",
  dashboard: "Dashboard",
  profile: "Profile",
};

export const DASHBOARD_SIDEBAR_STRINGS = {
  logo: "ExamPrep",
  accountSettings: "Account Settings",
};

export const DASHBOARD_SIDEBAR_NAVIGATION = [
  { name: "Overview", href: "/", iconName: "barChart" },
  { name: "Test Papers", href: "/test-papers", iconName: "bookOpen" },
  { name: "Mock Tests", href: "/tests", iconName: "fileText" },
  { name: "Flashcards", href: "/flashcards", iconName: "brain" },
  { name: "Analytics", href: "/analytics", iconName: "trendingUp" },
  { name: "Goals", href: "/goals", iconName: "target" },
  { name: "Planner", href: "/planner", iconName: "calendar" },
  { name: "AI Tutor", href: "/tutor", iconName: "zap" },
];

export const UPLOAD_TEST_DIALOG_STRINGS = {
  title: "Upload New Test",
  description: "Upload question papers and answer sheets to create a new mock test",
  questionPaper: "Question Paper",
  dropQuestionPaper: "Drop your question paper here, or click to browse",
  chooseFile: "Choose File",
  answerSheet: "Answer Sheet (Optional)",
  uploadAnswerKey: "Upload answer key for automatic evaluation",
  testTitle: "Test Title",
  testTitlePlaceholder: "e.g., Physics Mock Test #13",
  subject: "Subject",
  selectSubject: "Select subject",
  duration: "Duration (minutes)",
  durationPlaceholder: "180",
  difficulty: "Difficulty",
  selectDifficulty: "Select difficulty",
  descriptionLabel: "Description (Optional)",
  descriptionPlaceholder: "Add any additional notes about this test...",
  cancel: "Cancel",
  uploadAndProcess: "Upload & Process",
  processedSuccessfully: "Test Processed Successfully!",
  processedDescription: "AI has extracted and verified the questions from your upload.",
  processingResults: "Processing Results:",
  addToLibrary: "Add to Test Library",
  subjects: {
    physics: "Physics",
    chemistry: "Chemistry",
    mathematics: "Mathematics",
    biology: "Biology",
  },
  difficulties: {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  },
  processingResultsList: [
    "• Found 60 questions",
    "• 45 Multiple Choice Questions",
    "• 15 Numerical Answer Type",
    "• Answer key matched successfully",
  ],
};