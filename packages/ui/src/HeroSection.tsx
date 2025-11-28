'use client'

import React from 'react'
import { Button } from '@repo/ui/ui/button'
import { Badge } from '@repo/ui/ui/badge'
import { Sparkles, Brain, Palette, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {

  return (
    <section className="relative overflow-hidden bg-fashion-gradient-subtle">
      <div className="absolute inset-0 bg-fashion-gradient opacity-10" />

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Fashion Design
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Generate Unique
                <span className="bg-fashion-gradient bg-clip-text text-transparent block">
                  Fashion Designs
                </span>
                with GAN AI
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience the future of fashion design with our Generative Adversarial Network.
                Create stunning, original clothing designs from random noise using advanced
                machine learning trained on fashion datasets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/samples">
            <Button
                variant="default"
                size="lg"
                className="group bg-fashion-gradient hover:opacity-90"
                onClick={() => {}}
              >

                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                View Samples
              </Button>
              </Link>
            <Link href="/generate">
              <Button variant="outline" size="lg"
                onClick={() => {}}
                >
                <Palette className="w-5 h-5" />
                Start Generation
              </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Neural Networks</h3>
                <p className="text-sm text-muted-foreground">GAN Architecture</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Fast Generation</h3>
                <p className="text-sm text-muted-foreground">Instant Results</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-1">Unique Designs</h3>
                <p className="text-sm text-muted-foreground">Never Repeating</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-fashion-hover">
            <Image
                src="/assets/fashion-hero.jpg"
                alt="AI Fashion Design Studio"
                width={1200}
                height={600}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-fashion-gradient opacity-20" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-accent/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-primary/10 backdrop-blur-sm rounded-full p-3">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
