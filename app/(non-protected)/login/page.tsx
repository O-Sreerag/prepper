import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">ExamPrep</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your intelligent exam preparation companion</p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  )
}
