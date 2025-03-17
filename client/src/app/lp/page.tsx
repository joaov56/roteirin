"use client"

import { useState } from "react"
import { Calendar, Globe, Heart, MapPin, Menu, Moon, Sun, User, LogOut, Plane, Compass, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className={cn("min-h-screen flex flex-col", theme === "dark" ? "dark" : "")}>
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold text-xl">Roteirizando</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-muted-foreground">Hello, Guest</div>
            <Button variant="ghost" size="sm" className="gap-2">
              <User size={16} />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-950">AI Travel Itinerary Generator</h1>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto mb-12">
              Plan your perfect trip with personalized recommendations tailored to your preferences
            </p>
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              <Plane className="h-5 w-5" />
              Start Planning Now
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-950">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Choose Your Destination</h3>
                <p className="text-blue-700">
                  Tell us where you want to go and when. From popular cities to hidden gems, we&apos;ve got you covered.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Set Your Preferences</h3>
                <p className="text-blue-700">
                  Specify your budget and interests. Whether you&apos;re into museums, food, or hiking, we&apos;ll tailor
                  recommendations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-900">Get Your Itinerary</h3>
                <p className="text-blue-700">
                  Our AI generates a personalized day-by-day plan optimized for your time and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white border border-blue-100 rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-900">Plan Your Trip</h3>
                  <p className="text-blue-700 mb-6">
                    Enter your destination and travel dates to get a personalized itinerary.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-900">Destination</label>
                      <Input placeholder="e.g., Paris, France" className="border-blue-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-blue-900">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-blue-200"
                            >
                              {startDate ? format(startDate, "PPP") : "Pick a date"}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-blue-900">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-blue-200"
                            >
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-900">Budget (optional)</label>
                      <Input placeholder="Your budget in USD" className="border-blue-200" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-900">
                        Preferences (optional, comma-separated)
                      </label>
                      <Input placeholder="e.g., museums, food, hiking" className="border-blue-200" />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">Generate Itinerary</Button>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-4 text-blue-950">Ready to plan your trip?</h2>
                <p className="text-xl text-blue-700 mb-6">
                  Fill out the form with your destination and travel dates to get a personalized itinerary.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-fit">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-blue-800">AI-powered recommendations based on your preferences</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-fit">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-blue-800">Day-by-day itineraries optimized for your time</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-full h-fit">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-blue-800">Budget-friendly options tailored to your needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center bg-gradient-to-b from-purple-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">Ready for your next adventure?</h2>
            <p className="text-xl text-indigo-700 max-w-2xl mx-auto mb-8">
              Start planning your dream trip today with our AI-powered itinerary generator.
            </p>
            <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-white">
              <Plane className="h-5 w-5" />
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MapPin className="h-5 w-5 text-blue-300" />
              <span className="font-bold">Roteirizando</span>
            </div>

            <div className="text-sm text-blue-200">
              Built with <Heart className="h-4 w-4 inline text-red-400" /> using Next.js, Fastify, and OpenAI
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                Privacy
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                Terms
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-blue-800">
                Contact
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

