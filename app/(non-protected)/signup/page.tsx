import { SignupForm } from "@/app/(non-protected)/_components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carrot } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <Carrot className="size-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Pepper</h1>
      </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl tracking-tight">Create your account</CardTitle>
          <CardDescription>Join our community to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}