"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { TestPaperDetailsType, ParsedQuestionType } from "../_types/questions"
import { SingleQuestionReview } from "./single-question-review"

interface TestPaperDetailsProps {
  testPaper: TestPaperDetailsType
}

export const TestPaperDetails = ({ testPaper }: TestPaperDetailsProps) => {
  const router = useRouter()
  const [selectedQuestion, setSelectedQuestion] = useState<ParsedQuestionType | null>(null)

  const statusColors: Record<string, string> = {
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    review: "bg-purple-100 text-purple-800",
    failed: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  }

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  }

  const reviewStatusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_changes: "bg-orange-100 text-orange-800",
  }

  const handleReviewQuestion = (question: ParsedQuestionType) => {
    setSelectedQuestion(question)
  }

  const handleBackFromReview = () => {
    setSelectedQuestion(null)
  }

  if (selectedQuestion) {
    return (
      <SingleQuestionReview
        question={selectedQuestion}
        testPaper={testPaper}
        onBack={handleBackFromReview}
      />
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="bg-transparent"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{testPaper.title}</h1>
          <p className="text-muted-foreground">{testPaper.description}</p>
        </div>
        <Badge className={statusColors[testPaper.status]}>
          {testPaper.status}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Paper Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.fileText className="h-5 w-5" />
                Test Paper Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="font-semibold">{testPaper.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="font-semibold">{testPaper.duration_minutes || 'N/A'} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                  <div className="mt-1">
                    <Badge className={difficultyColors[testPaper.difficulty || 'medium']}>
                      {testPaper.difficulty || 'medium'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="font-semibold">
                    {new Date(testPaper.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {testPaper.tags && testPaper.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {testPaper.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Information */}
          {testPaper.upload_progress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.barChart className="h-5 w-5" />
                  Processing Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Files</label>
                    <p className="font-semibold">
                      {testPaper.upload_progress.total_files} total
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pages</label>
                    <p className="font-semibold">
                      {testPaper.upload_progress.pages_processed} / {testPaper.upload_progress.total_pages}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Questions Found</label>
                    <p className="font-semibold">{testPaper.upload_progress.questions_found}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Questions Parsed</label>
                    <p className="font-semibold">{testPaper.upload_progress.questions_parsed}</p>
                  </div>
                </div>
                
                {testPaper.upload_progress.total_pages > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Page Processing</label>
                    <Progress 
                      value={(testPaper.upload_progress.pages_processed / testPaper.upload_progress.total_pages) * 100}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.helpCircle className="h-5 w-5" />
                Questions ({testPaper.parsed_questions?.length || 0})
              </CardTitle>
              <CardDescription>
                Review and manage parsed questions from this test paper
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testPaper.parsed_questions && testPaper.parsed_questions.length > 0 ? (
                <div className="space-y-4">
                  {testPaper.parsed_questions.map((question, index) => (
                    <div
                      key={question.parsed_questions_id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Q{index + 1}
                            </span>
                            <Badge className={reviewStatusColors[question.review_status]}>
                              {question.review_status}
                            </Badge>
                            {question.need_review && (
                              <Badge variant="outline" className="text-orange-600">
                                Needs Review
                              </Badge>
                            )}
                            {question.page_number && (
                              <span className="text-xs text-muted-foreground">
                                Page {question.page_number}
                              </span>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{question.question_text}</p>
                          {question.options && (
                            <div className="text-xs text-muted-foreground">
                              {question.options.options.length} options
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewQuestion(question)}
                            className="bg-transparent"
                          >
                            <Icons.eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icons.fileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No questions parsed yet</p>
                  {testPaper.status === 'completed' && (
                    <p className="text-sm">Try processing the test paper again</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Files */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {testPaper.status === 'review' && (
                <Button className="w-full justify-start">
                  <Icons.checkCircle className="mr-2 h-4 w-4" />
                  Start Review Session
                </Button>
              )}
              {testPaper.status === 'completed' && (
                <Button className="w-full justify-start">
                  <Icons.play className="mr-2 h-4 w-4" />
                  Start Practice Test
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Icons.download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Icons.share className="mr-2 h-4 w-4" />
                Share Test Paper
              </Button>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {testPaper.upload_files && testPaper.upload_files.length > 0 ? (
                testPaper.upload_files.map((file) => (
                  <div key={file.upload_file_id} className="flex items-center gap-3 p-2 rounded border">
                    <Icons.file className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.pages_count || '?'} pages • {file.mime_type}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icons.externalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No files uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
