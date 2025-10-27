import { Clover } from 'lucide-react'
import { Button } from '@/theme/components/button'
import { motion } from 'framer-motion'

export default function GetStartedSection() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-32 mt-20">
      <motion.div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-md border border-primary/30 p-16 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-white">Join thousands of designers</span>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ready to bring your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-primary-light">
              ideas to life?
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-foreground mb-10 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Start creating beautiful wireframes in seconds.<br />
            No credit card required. No design experience needed.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              size="lg"
              className="h-16 px-10 text-lg font-semibold shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all"
            >
              <Clover className="h-5 w-5" />
              Get Started Free
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="h-16 px-10 text-lg font-semibold border-white/30 hover:bg-white/10"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

