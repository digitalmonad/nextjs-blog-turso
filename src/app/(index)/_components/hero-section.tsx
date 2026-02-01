"use client";
import { Button } from "@/components/ui/button";
import { AppleIcon, ArrowRight, AxeIcon, LeafIcon } from "lucide-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <section className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight mb-6">
              <h1>Insights that{"\n"}</h1>

              <span className="text-primary italic">fuels your growth</span>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
              Content about tech, design, and creativity from a digital gardener
              who believes in the power of thoughtful storytelling.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Button size="lg" className="group">
                Read the Latest Post{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/90 rounded-full blur-3xl absolute -top-10 -right-10"></div>

              <motion.div
                whileHover={{ scale: 0.99 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-96 h-96 bg-gradient-to-tl from-secondary/30 to-primary/30 rounded-2xl transform rotate-15 shadow-2xl"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
