import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-matte-950 px-4">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "bg-matte-900 border border-matte-800 shadow-elevated rounded-xl w-full",
            headerTitle: "text-white font-display text-2xl",
            headerSubtitle: "text-matte-400",

            // Form fields
            formFieldLabel: "text-matte-200 text-sm font-medium",
            formFieldInput:
              "bg-matte-800 border border-matte-700 text-white rounded-lg placeholder:text-matte-600 focus:border-red-600 focus:ring-0",
            formFieldInputShowPasswordButton: "text-matte-400 hover:text-white",

            // Hint text — "8 characters minimum" etc
            formFieldHintText: "text-matte-500 text-xs",
            formFieldErrorText: "text-red-400 text-xs",
            formFieldSuccessText: "text-green-400 text-xs",

            // OTP / verification code boxes
            otpCodeFieldInput:
              "bg-matte-800 border border-matte-700 text-white text-center text-xl font-bold rounded-lg focus:border-red-600",
            otpCodeField: "gap-2",

            // Resend code link + other action links below fields
            formResendCodeLink: "text-matte-400 hover:text-white transition-colors",
            formFieldAction: "text-red-500 hover:text-red-400 text-sm",

            // Buttons
            formButtonPrimary:
              "bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors",
            formButtonReset: "text-matte-400 hover:text-white",

            // Footer
            footerActionText: "text-matte-400",
            footerActionLink: "text-red-500 hover:text-red-400 font-medium",

            // Divider
            dividerLine: "bg-matte-800",
            dividerText: "text-matte-500 text-xs",

            // Social buttons
            socialButtonsBlockButton:
              "bg-matte-800 border border-matte-700 text-white hover:bg-matte-700 rounded-lg transition-colors",
            socialButtonsBlockButtonText: "text-white font-medium",
            socialButtonsBlockButtonArrow: "text-matte-400",

            // Identity preview (email shown above OTP)
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-red-500 hover:text-red-400",

            // Alternative methods
            alternativeMethodsBlockButton:
              "text-matte-400 hover:text-white border border-matte-700 hover:border-matte-500 rounded-lg transition-colors",
            alternativeMethodsBlockButtonText: "text-matte-300",

            // Alert/info boxes
            alertText: "text-matte-300",
            alert: "bg-matte-800 border border-matte-700 rounded-lg",
          },
        }}
      />
    </main>
  );
}