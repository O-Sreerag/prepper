"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { AuthService } from "@/services/api/auth.service"
import { toastWithTimeout, ToastVariant } from "@/hooks/use-toast"
import { showErrorMessage } from "@/lib/utils"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const authService = new AuthService()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toastWithTimeout(ToastVariant.Error, "Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      await authService.resetPassword(password)
      toastWithTimeout(ToastVariant.Success, "Password updated successfully! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      showErrorMessage({ error: err, fallbackMessage: "An unexpected error occurred." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Reset Password
      </Button>
    </form>
  )
}
