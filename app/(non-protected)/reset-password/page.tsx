import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResetPasswordForm } from "@/app/(non-protected)/_components"

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
