"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"

interface UploadTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadTestDialog({ open, onOpenChange }: UploadTestDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(1)

  const handleUpload = async () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setUploadStep(2)
      setIsUploading(false)
    }, 2000)
  }

  const handleConfirm = () => {
    setUploadStep(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Test</DialogTitle>
          <DialogDescription>Upload question papers and answer sheets to create a new mock test</DialogDescription>
        </DialogHeader>

        {uploadStep === 1 && (
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question Paper</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Icons.upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Drop your question paper here, or click to browse
                  </div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Answer Sheet (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Icons.fileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">Upload answer key for automatic evaluation</div>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-title">Test Title</Label>
                <Input id="test-title" placeholder="e.g., Physics Mock Test #13" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="180" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" placeholder="Add any additional notes about this test..." />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Upload & Process
              </Button>
            </div>
          </div>
        )}

        {uploadStep === 2 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Icons.checkCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Test Processed Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                AI has extracted and verified the questions from your upload.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Processing Results:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Found 60 questions</li>
                <li>• 45 Multiple Choice Questions</li>
                <li>• 15 Numerical Answer Type</li>
                <li>• Answer key matched successfully</li>
              </ul>
            </div>

            <Button onClick={handleConfirm} className="w-full">
              Add to Test Library
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
