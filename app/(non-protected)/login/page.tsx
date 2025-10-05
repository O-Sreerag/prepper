import { LoginForm } from "@/app/(non-protected)/_components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carrot } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Carrot className="size-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Pepper</h1>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">Welcome back!</CardTitle>
          <CardDescription>Let's get you signed in.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <Link href="/forgot-password"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground">
          New to Pepper?{" "}
          <Link href="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}