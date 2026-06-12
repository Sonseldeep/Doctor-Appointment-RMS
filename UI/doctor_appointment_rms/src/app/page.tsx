import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Problems } from '@/components/landing/problems'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CTA } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Problems />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}
