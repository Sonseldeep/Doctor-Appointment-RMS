// import { Navbar } from '@/components/landing/navbar'
// import { Hero } from '@/components/landing/hero'
// import { Problems } from '@/components/landing/problems'
// import { HowItWorks } from '@/components/landing/how-it-works'
// import { CTA } from '@/components/landing/cta'
// import { Footer } from '@/components/landing/footer'

// export default function Page() {
//   return (
//     <main className="min-h-screen bg-background">
//       <Navbar />
//       <Hero />
//       <Problems />
//       <HowItWorks />
//       <CTA />
//       <Footer />
//     </main>
//   )
// }


import { redirect } from "next/navigation";

export default function Page() {
  // Bounces incoming traffic on localhost:3000 straight to the login route cleanly
  redirect("/login");
}

// import { LoginForm } from "@/features/auth/components/login-form";

// export default function Page() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
//       <LoginForm />
//     </main>
//   );
// }