import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-matte-950">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-matte-900 border border-matte-700 shadow-elevated rounded-xl p-6 sm:p-8",
            headerTitle: "text-white font-display text-heading-2",
            headerSubtitle: "text-matte-300",
            formFieldLabel: "text-matte-200",
            formFieldInput: "bg-matte-800 border-matte-700 text-white rounded-lg placeholder:text-matte-500",
            formFieldInputCode: "bg-matte-800 border-matte-700 text-white text-center text-2xl rounded-lg",
            formButtonPrimary: "bg-crimson hover:bg-crimson-dark text-white font-semibold rounded-lg",
            footerActionLink: "text-crimson hover:text-crimson-dark",
            footerActionText: "text-matte-300",
            dividerLine: "bg-matte-700",
            dividerText: "text-matte-400",
            formFieldInputShowPasswordButton: "text-matte-300",
            socialButtonsBlockButton: "bg-matte-800 border border-matte-700 text-white hover:bg-matte-700 rounded-lg",
            socialButtonsBlockButtonText: "text-white font-medium",
            formFieldErrorText: "text-red-400",
            alertText: "text-matte-300",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-crimson",
            // Verification code specific
            codeControl: "bg-matte-800 border-matte-700 text-white rounded-lg",
            otpCodeFieldInput: "bg-matte-800 border-matte-700 text-white text-center text-2xl rounded-lg focus:border-crimson",
          },
        }}
      />
    </main>
  );
}