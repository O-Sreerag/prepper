"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { CREATE_FLASHCARD_DIALOG_STRINGS as STRINGS } from "@/constants"

interface CreateFlashcardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFlashcardDialog({ open, onOpenChange }: CreateFlashcardDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{STRINGS.title}</DialogTitle>
          <DialogDescription>{STRINGS.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">{STRINGS.manualCreation}</TabsTrigger>
            <TabsTrigger value="ai">{STRINGS.aiGeneration}</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deck-title">{STRINGS.deckTitle}</Label>
                <Input id="deck-title" placeholder={STRINGS.deckTitlePlaceholder} />
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
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{STRINGS.addCards}</h4>
              <div className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor="front">{STRINGS.frontLabel}</Label>
                  <Textarea id="front" placeholder={STRINGS.frontPlaceholder} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="back">{STRINGS.backLabel}</Label>
                  <Textarea id="back" placeholder={STRINGS.backPlaceholder} />
                </div>
                <Button size="sm" variant="outline" className="bg-transparent">
                  <Icons.brain className="mr-2 h-4 w-4" />
                  {STRINGS.addCard}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {STRINGS.cancel}
              </Button>
              <Button>{STRINGS.createDeck}</Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ai-deck-title">{STRINGS.deckTitle}</Label>
                <Input id="ai-deck-title" placeholder={STRINGS.aiDeckTitlePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-subject">{STRINGS.subject}</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{STRINGS.contentSource}</Label>
              <Textarea id="content" placeholder={STRINGS.contentSourcePlaceholder} className="min-h-[120px]" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="card-count">{STRINGS.numCards}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={STRINGS.selectNumCards} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STRINGS.numCardOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-difficulty">{STRINGS.difficulty}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={STRINGS.selectDifficulty} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STRINGS.difficultyOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {STRINGS.cancel}
              </Button>
              <Button onClick={handleAIGenerate} disabled={isGenerating}>
                {isGenerating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {STRINGS.generateWithAI}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
