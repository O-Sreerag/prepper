"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { UPLOAD_TEST_DIALOG_STRINGS as STRINGS } from "@/constants"

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
          <DialogTitle>{STRINGS.title}</DialogTitle>
          <DialogDescription>{STRINGS.description}</DialogDescription>
        </DialogHeader>

        {uploadStep === 1 && (
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{STRINGS.questionPaper}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Icons.upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">{STRINGS.dropQuestionPaper}</div>
                  <Button variant="outline" size="sm">
                    {STRINGS.chooseFile}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{STRINGS.answerSheet}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Icons.fileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">{STRINGS.uploadAnswerKey}</div>
                  <Button variant="outline" size="sm">
                    {STRINGS.chooseFile}
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="test-title">{STRINGS.testTitle}</Label>
                <Input id="test-title" placeholder={STRINGS.testTitlePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{STRINGS.subject}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={STRINGS.selectSubject} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STRINGS.subjects).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">{STRINGS.duration}</Label>
                <Input id="duration" type="number" placeholder={STRINGS.durationPlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">{STRINGS.difficulty}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={STRINGS.selectDifficulty} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STRINGS.difficulties).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{STRINGS.descriptionLabel}</Label>
              <Textarea id="description" placeholder={STRINGS.descriptionPlaceholder} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {STRINGS.cancel}
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {STRINGS.uploadAndProcess}
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
              <h3 className="text-lg font-semibold mb-2">{STRINGS.processedSuccessfully}</h3>
              <p className="text-muted-foreground mb-4">{STRINGS.processedDescription}</p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">{STRINGS.processingResults}</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {STRINGS.processingResultsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <Button onClick={handleConfirm} className="w-full">
              {STRINGS.addToLibrary}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
