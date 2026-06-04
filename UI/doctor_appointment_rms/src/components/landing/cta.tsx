'use client'

export function CTA() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Ready to simplify your healthcare?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of patients who trust DocFlow for their healthcare needs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg">
              Get Started Free
            </button>
            <button className="rounded-lg border-2 border-primary px-8 py-4 text-lg font-semibold text-primary hover:bg-primary/5 transition-all">
              Learn More
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 border-t border-border/50 space-y-4">
            <p className="text-sm text-muted-foreground">Trusted by patients and doctors alike</p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> 256-bit Encryption
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> 99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
