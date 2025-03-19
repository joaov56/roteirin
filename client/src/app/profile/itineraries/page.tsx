"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { getUserItineraries, type Itinerary } from "@/services/api"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarDays, MapPin, Wallet, Plus, Search, Share2, MoreHorizontal, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const data = await getUserItineraries()
        setItineraries(data)
        setFilteredItineraries(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch itineraries:", err)
        setError("Failed to load your itineraries. Please try again later.")
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [])

  useEffect(() => {
    // Filter itineraries based on search query and active tab
    let filtered = [...itineraries]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((itinerary) => itinerary.destination.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply tab filter
    if (activeTab !== "all") {
      const now = new Date()

      if (activeTab === "upcoming") {
        filtered = filtered.filter((itinerary) => new Date(itinerary.startDate) > now)
      } else if (activeTab === "past") {
        filtered = filtered.filter((itinerary) => new Date(itinerary.endDate) < now)
      } else if (activeTab === "active") {
        filtered = filtered.filter(
          (itinerary) => new Date(itinerary.startDate) <= now && new Date(itinerary.endDate) >= now,
        )
      }
    }

    setFilteredItineraries(filtered)
  }, [searchQuery, activeTab, itineraries])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTripStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) {
      return { label: "Upcoming", color: "bg-blue-500" }
    } else if (now > end) {
      return { label: "Past", color: "bg-gray-500" }
    } else {
      return { label: "Active", color: "bg-green-500" }
    }
  }

  const getDaysUntil = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return null
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `In ${diffDays} days`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container py-10">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold">Your Itineraries</h1>
                <p className="text-muted-foreground mt-1">Manage and explore your travel plans</p>
              </div>
              <Link href="/">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Itinerary
                </Button>
              </Link>
            </div>

            {/* Search and Filter Section */}
            {!loading && !error && itineraries.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search destinations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Content Section */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-10 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-destructive font-medium mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : itineraries.length === 0 ? (
              <div className="text-center p-16 bg-muted/30 rounded-lg border border-border">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">No itineraries yet</h2>
                <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                  Start planning your next adventure by creating your first travel itinerary!
                </p>
                <Link href="/">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Itinerary
                  </Button>
                </Link>
              </div>
            ) : filteredItineraries.length === 0 ? (
              <div className="text-center p-10 bg-muted/30 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-2">No matching itineraries</h2>
                <p className="mb-4 text-muted-foreground">
                  Try adjusting your search or filters to find what youxre looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTab("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItineraries.map((itinerary) => {
                  const status = getTripStatus(itinerary.startDate, itinerary.endDate)
                  const daysUntil = getDaysUntil(itinerary.startDate)

                  return (
                    <Card
                      key={itinerary.id}
                      className="overflow-hidden group hover:shadow-md transition-all duration-300 border-border"
                    >
                      <div className="relative h-40 bg-muted">
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
                          style={{
                            backgroundImage: `url(/placeholder.svg?height=400&width=600)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.color}`} />
                          <Badge variant="secondary" className="bg-black/50 hover:bg-black/60">
                            {status.label}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-xl font-bold text-white line-clamp-1">{itinerary.destination}</h3>
                        </div>
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/60 text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardContent className="space-y-3 pt-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{itinerary.destination}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                          </span>
                        </div>
                        {daysUntil && (
                          <div className="flex items-center text-sm text-blue-500 font-medium">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{daysUntil}</span>
                          </div>
                        )}
                        {itinerary.budget && (
                          <div className="flex items-center text-sm">
                            <Wallet className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>Budget: ${itinerary.budget}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm pt-1">
                          <span>
                            {itinerary.items.length} day{itinerary.items.length !== 1 ? "s" : ""}
                          </span>
                          <span>
                            {itinerary.items.reduce((total, day) => total + day.activities.length, 0)} activities
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Link href={`/itinerary/${itinerary.id}`} className="w-full">
                          <Button variant="default" className="w-full">
                            View Itinerary
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

