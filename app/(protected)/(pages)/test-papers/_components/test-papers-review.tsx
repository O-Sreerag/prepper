"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestPaperGetAllType } from "@/lib/types"

// Based on the DB schema for parsed_questions
type ParsedQuestion = {
  id: string;
  question_text: string;
  options: { options: string[] };
  detected_answer: string;
  review_status: string;
};

interface QuestionReviewProps {
  testPaper: TestPaperGetAllType;
  onBack: () => void;
}

export function QuestionReview({ testPaper, onBack }: QuestionReviewProps) {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchParsedQuestions() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/uploads/${testPaper.testPaperId}/parsed`);
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch parsed questions.");
        }
        setQuestions(result.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchParsedQuestions();
  }, [testPaper.testPaperId]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                <Icons.arrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Reviewing: {testPaper.title}</h1>
                <p className="text-muted-foreground">
                    Review and confirm the questions extracted by the AI.
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Save Progress</Button>
            <Button>Confirm All & Finalize</Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="border rounded-lg p-8 text-center bg-destructive/10 text-destructive">
          <h2 className="text-xl font-semibold">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Question {index + 1}</span>
                  <Badge variant={q.review_status === 'pending' ? 'secondary' : 'default'}>
                    {q.review_status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea defaultValue={q.question_text} rows={3} />
                <div className="grid grid-cols-2 gap-4">
                  {q.options.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input defaultValue={opt} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Detected Answer:</span>
                    <Input defaultValue={q.detected_answer} className="w-24" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="destructive">Flag for Review</Button>
                <Button variant="outline">Save Changes</Button>
                <Button variant="secondary">Confirm</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Add a fallback for the arrowLeft icon if it doesn't exist in Icons
Icons.arrowLeft = Icons.arrowLeft || (({ className }) => <span className={className}>&larr;</span>);
