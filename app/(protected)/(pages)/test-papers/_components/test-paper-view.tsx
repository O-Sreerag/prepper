"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { TestPaperGetAllType } from "@/lib/types"

interface TestPaperViewProps {
  testPaper: TestPaperGetAllType & { 
    uploadFiles?: any;
    parsed_questions?: any[];
    upload_progress?: any;
  }
}

export const TestPaperView = ({ testPaper }: TestPaperViewProps) => {
  const router = useRouter()

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

  // Construct the full Supabase storage URL for PDF
  const getPdfUrl = (uploadFile: any) => {
    if (!uploadFile || !uploadFile.storageUrl) return null;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'prepper-assets';
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${uploadFile.storageUrl}`;
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
          <p className="text-muted-foreground">{testPaper.description || 'No description available'}</p>
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
                  <p className="font-semibold capitalize">{testPaper.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="font-semibold">{testPaper.durationMinutes || 'N/A'} minutes</p>
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
                    {testPaper.createdAt ? new Date(testPaper.createdAt).toLocaleDateString() : 'N/A'}
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

          {/* PDF Preview */}
          {testPaper.uploadFiles && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.fileText className="h-5 w-5" />
                  PDF Document
                </CardTitle>
                <CardDescription>
                  View and download the uploaded test paper PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Icons.file className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{testPaper.uploadFiles.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {testPaper.uploadFiles.mimeType} • {testPaper.uploadFiles.fileRole}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const pdfUrl = getPdfUrl(testPaper.uploadFiles);
                        if (pdfUrl) window.open(pdfUrl, '_blank');
                      }}
                    >
                      <Icons.eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const pdfUrl = getPdfUrl(testPaper.uploadFiles);
                        if (pdfUrl) {
                          const link = document.createElement('a');
                          link.href = pdfUrl;
                          link.download = testPaper.uploadFiles.filename;
                          link.click();
                        }
                      }}
                    >
                      <Icons.download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Questions Preview */}
          {testPaper.parsed_questions && testPaper.parsed_questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.helpCircle className="h-5 w-5" />
                  Questions ({testPaper.parsed_questions.length})
                </CardTitle>
                <CardDescription>
                  Preview of parsed questions from this test paper
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testPaper.parsed_questions.slice(0, 5).map((question, index) => (
                    <div
                      key={question.parsed_questions_id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Q{index + 1}
                            </span>
                            {question.page_number && (
                              <span className="text-xs text-muted-foreground">
                                Page {question.page_number}
                              </span>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{question.question_text}</p>
                          {question.options && (
                            <div className="text-xs text-muted-foreground">
                              {question.options.options?.length || 0} options
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {testPaper.parsed_questions.length > 5 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View All {testPaper.parsed_questions.length} Questions
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions & Metadata */}
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
              {testPaper.uploadFiles && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    const pdfUrl = getPdfUrl(testPaper.uploadFiles);
                    if (pdfUrl) window.open(pdfUrl, '_blank');
                  }}
                >
                  <Icons.eye className="mr-2 h-4 w-4" />
                  View PDF
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Icons.share className="mr-2 h-4 w-4" />
                Share Test Paper
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Test Paper ID</label>
                <p className="text-xs font-mono break-all">{testPaper.testPaperId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="text-sm">{testPaper.createdAt ? new Date(testPaper.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">{testPaper.updatedAt ? new Date(testPaper.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
