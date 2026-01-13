export const TEST_PAPER_SUBJECT_OPTIONS = [
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "mathematics", label: "Mathematics" },
]

export const TEST_PAPER_DIFFICULTY_OPTIONS = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
]

export const statusColors: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    review: "bg-purple-100 text-purple-800",
    failed: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
}

export const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
}