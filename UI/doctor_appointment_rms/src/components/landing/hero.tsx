'use client'

import { Calendar, Clock, FileText } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Healthcare made
                <span className="block text-primary">simple</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Book appointments, view your medical records, and manage your health—all in one place.
              </p>
            </div>

            <button className="w-full sm:w-auto rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg">
              Start Free
            </button>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted-foreground">Patients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-xs text-muted-foreground">Clinics</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Demo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: Book Appointment */}
            <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="rounded-xl bg-primary/10 p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Book Appointments</h3>
              <p className="text-sm text-muted-foreground">
                Schedule with your doctor in seconds
              </p>
            </div>

            {/* Card 2: Your Records */}
            <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="rounded-xl bg-primary/10 p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Your Records</h3>
              <p className="text-sm text-muted-foreground">
                All your medical history in one place
              </p>
            </div>

            {/* Card 3: Reminders */}
            <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="rounded-xl bg-primary/10 p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Never miss an appointment again
              </p>
            </div>

            {/* Card 4: More Features */}
            <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2">
              <div className="rounded-xl bg-primary/10 p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-lg font-bold text-primary">+</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">And More</h3>
              <p className="text-sm text-muted-foreground">
                Secure messaging, prescriptions & more
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
