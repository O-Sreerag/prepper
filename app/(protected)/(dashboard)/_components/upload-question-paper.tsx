"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function UploadQuestionPaper() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: "Your question paper has been processed.",
        })
        // Here you would typically handle the extracted questions,
        // for example, by updating the application's state or navigating to a new page.
        console.log("Extracted Questions:", result.data)
      } else {
        throw new Error(result.error || "Unknown error occurred")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setFile(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Question Paper</CardTitle>
        <CardDescription>
          Upload a PDF or image of a question paper to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" onChange={handleFileChange} accept="application/pdf,image/*" />
        <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full">
          {isUploading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Icons.upload className="mr-2 h-4 w-4" />
              Upload and Process
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}