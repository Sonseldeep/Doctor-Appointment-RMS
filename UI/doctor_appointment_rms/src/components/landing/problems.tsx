'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const problems = [
  {
    id: 1,
    problem: 'Long wait times for appointments',
    solution: 'Book instantly online, see real-time availability',
  },
  {
    id: 2,
    problem: 'Can\'t find your medical records',
    solution: 'Access all your records digitally anytime, anywhere',
  },
  {
    id: 3,
    problem: 'Forgetting important appointments',
    solution: 'Get automatic reminders via SMS and email',
  },
  {
    id: 4,
    problem: 'Paper prescriptions get lost',
    solution: 'Digital prescriptions sent directly to pharmacies',
  },
]

export function Problems() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Healthcare shouldn't be complicated
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We solve the problems you face every day
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg cursor-pointer overflow-hidden"
            >
              {/* Problem State */}
              <div
                className={`transition-all duration-300 ${
                  hoveredId === item.id
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-destructive/10 p-3 shrink-0 mt-1">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {item.problem}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Solution State */}
              <div
                className={`transition-all duration-300 ${
                  hoveredId === item.id
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-success/10 p-3 shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {item.solution}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
