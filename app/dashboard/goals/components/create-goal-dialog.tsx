"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { CREATE_GOAL_DIALOG_STRINGS as STRINGS } from "@/constants"

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const [goalType, setGoalType] = useState("")

  const getGoalSuggestions = (type: string) => {
    switch (type) {
      case "daily":
        return STRINGS.suggestions.daily
      case "weekly":
        return STRINGS.suggestions.weekly
      case "monthly":
        return STRINGS.suggestions.monthly
      default:
        return []
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{STRINGS.title}</DialogTitle>
          <DialogDescription>{STRINGS.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">{STRINGS.goalTitle}</Label>
            <Input id="goal-title" placeholder={STRINGS.goalTitlePlaceholder} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">{STRINGS.descriptionLabel}</Label>
            <Textarea id="goal-description" placeholder={STRINGS.descriptionPlaceholder} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-type">{STRINGS.goalType}</Label>
              <Select value={goalType} onValueChange={setGoalType}>
                <SelectTrigger>
                  <SelectValue placeholder={STRINGS.selectType} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STRINGS.goalTypes).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{STRINGS.priority}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={STRINGS.selectPriority} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STRINGS.priorities).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target">{STRINGS.targetValue}</Label>
              <Input id="target" type="number" placeholder={STRINGS.targetValuePlaceholder} />
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

          <div className="space-y-2">
            <Label htmlFor="deadline">{STRINGS.deadline}</Label>
            <Input id="deadline" type="date" />
          </div>

          {goalType && (
            <div className="space-y-2">
              <Label>{STRINGS.quickSuggestions}</Label>
              <div className="flex flex-wrap gap-2">
                {getGoalSuggestions(goalType).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                    onClick={() => {
                      const titleInput = document.getElementById("goal-title") as HTMLInputElement
                      if (titleInput) titleInput.value = suggestion
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {STRINGS.cancel}
            </Button>
            <Button>
              <Icons.target className="mr-2 h-4 w-4" />
              {STRINGS.createGoal}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
