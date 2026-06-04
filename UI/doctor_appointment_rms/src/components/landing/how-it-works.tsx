'use client'

import { UserPlus, Calendar, CheckCircle2, Zap } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in under 2 minutes with your email',
  },
  {
    number: '2',
    icon: Calendar,
    title: 'Book Appointment',
    description: 'Browse available slots and book instantly',
  },
  {
    number: '3',
    icon: CheckCircle2,
    title: 'Visit Doctor',
    description: 'Show up to your appointment on time',
  },
  {
    number: '4',
    icon: Zap,
    title: 'Manage Health',
    description: 'Access records, prescriptions, and reminders',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Simple 4-step process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with DocFlow in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] right-[calc(-100%+2rem)] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}

                {/* Step Card */}
                <div className="relative z-10 rounded-2xl border border-border/50 bg-card p-8 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
