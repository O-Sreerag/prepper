"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ParsedQuestionType, TestPaperDetailsType } from "../types/questions"

interface SingleQuestionReviewProps {
  question: ParsedQuestionType
  testPaper: TestPaperDetailsType
  onBack: () => void
}

export function SingleQuestionReview({ question, testPaper, onBack }: SingleQuestionReviewProps) {
  const [editedQuestion, setEditedQuestion] = useState(question.question_text)
  const [editedOptions, setEditedOptions] = useState(question.options?.options || [])
  const [editedAnswer, setEditedAnswer] = useState(question.detected_answer || "")
  const [reviewNotes, setReviewNotes] = useState("")
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected' | 'needs_changes'>('approved')

  const handleSaveReview = async () => {
    try {
      const response = await fetch(`/api/test-paper/${question.test_paper_id}/review-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.parsed_questions_id,
          questionText: editedQuestion,
          options: editedOptions,
          detectedAnswer: editedAnswer,
          reviewStatus,
          reviewNotes,
        }),
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to save review')
      }

      onBack()
    } catch (error) {
      console.error('Error saving review:', error)
      alert(error instanceof Error ? error.message : 'Failed to save review')
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedOptions]
    newOptions[index] = value
    setEditedOptions(newOptions)
  }

  const addOption = () => {
    setEditedOptions([...editedOptions, ""])
  }

  const removeOption = (index: number) => {
    if (editedOptions.length > 2) {
      const newOptions = editedOptions.filter((_, i) => i !== index)
      setEditedOptions(newOptions)
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_changes: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <Icons.arrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Review Question</h1>
            <p className="text-muted-foreground">
              Test Paper: {testPaper.title} • Question ID: {question.parsed_questions_id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[question.review_status]}>
            {question.review_status}
          </Badge>
          {question.need_review && (
            <Badge variant="outline" className="text-orange-600">
              Needs Review
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Question Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                rows={4}
                placeholder="Enter question text..."
              />
            </CardContent>
          </Card>

          {/* Options Editor */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Answer Options</CardTitle>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Icons.checkCircle className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editedOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-8">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                  {editedOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.xCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Answer Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Correct Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={editedAnswer} onValueChange={setEditedAnswer}>
                {editedOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={String.fromCharCode(65 + index)} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={reviewStatus} onValueChange={(value: any) => setReviewStatus(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id="approved" />
                  <Label htmlFor="approved">Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs_changes" id="needs_changes" />
                  <Label htmlFor="needs_changes">Needs Changes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected">Rejected</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Review Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about this question..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Question Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Question Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Page:</span> {question.page_number || 'N/A'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Confidence:</span> {question.parse_confidence ? `${(question.parse_confidence * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Created:</span> {new Date(question.created_at).toLocaleDateString()}
              </div>
              {question.reviewed_at && (
                <div className="text-sm">
                  <span className="font-medium">Last Reviewed:</span> {new Date(question.reviewed_at).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleSaveReview} className="w-full">
                <Icons.checkCircle className="mr-2 h-4 w-4" />
                Save Review
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
