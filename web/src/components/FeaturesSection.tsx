import { Sparkles, Zap, Download, Users } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 pt-0">
      {/* Section Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-3xl blur-3xl" />
      
      <div className="relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-4">
            Everything you need to design faster
          </h2>
          <p className="text-xl text-foreground">
            Powerful features designed for modern designers
          </p>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Feature 1 - Spans 2 columns */}
          <div className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 p-10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-6 shadow-lg shadow-primary/50">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Design Generation</h3>
              <p className="text-base text-foreground leading-relaxed">
                Our advanced AI understands your vision and generates professional-grade wireframes 
                from simple text descriptions. No design skills required.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-yellow-500/50">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Get your wireframes in seconds. Iterate and refine at the speed of thought.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/50">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Export Anywhere</h3>
              <p className="text-sm text-foreground leading-relaxed">
                Seamlessly export to Figma, Sketch, or any format your workflow needs.
              </p>
            </div>
          </div>

          {/* Large Feature 4 - Spans 2 columns */}
          <div className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 p-10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-Time Collaboration</h3>
              <p className="text-base text-foreground leading-relaxed">
                Work together with your team in real-time. Share, comment, and iterate 
                collaboratively to bring the best ideas to life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

