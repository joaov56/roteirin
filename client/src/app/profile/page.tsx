"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  MapPin,
  Settings,
  LogOut,
  User,
  Mail,
  Calendar,
  Globe,
  Plane,
  Clock,
  CreditCard,
  Heart,
  Edit,
  PlusCircle,
  Bookmark,
} from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Mock data for travel stats
  const travelStats = {
    tripsPlanned: 12,
    countriesVisited: 8,
    upcomingTrips: 2,
    savedPlaces: 24,
  }

  // Mock data for upcoming trips
  const upcomingTrips = [
    {
      id: "trip1",
      destination: "Paris, France",
      date: "May 15 - May 22, 2025",
      daysUntil: 45,
    },
    {
      id: "trip2",
      destination: "Tokyo, Japan",
      date: "July 10 - July 24, 2025",
      daysUntil: 101,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold">Your Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account and travel preferences</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" className="gap-2 text-destructive" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information Card */}
              <Card className="col-span-1 overflow-hidden">
                <div className="bg-primary/10 p-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={""} alt={user?.name || "User"} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
                  <p className="text-muted-foreground">Travel Enthusiast</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-2">
                    <Edit className="h-3 w-3" />
                    Edit Profile
                  </Button>
                </div>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="text-base">{user?.name || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                        <p className="text-base">{user?.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                        <p className="text-base">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-3">Profile Completion</h3>
                    <Progress value={70} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete your profile to get personalized travel recommendations
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content Area */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {/* Travel Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Travel Statistics
                    </CardTitle>
                    <CardDescription>Your travel journey at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/40 rounded-lg p-4 text-center">
                        <Plane className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{travelStats.tripsPlanned}</p>
                        <p className="text-sm text-muted-foreground">Trips Planned</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-4 text-center">
                        <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{travelStats.countriesVisited}</p>
                        <p className="text-sm text-muted-foreground">Countries</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-4 text-center">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{travelStats.upcomingTrips}</p>
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-4 text-center">
                        <Bookmark className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold">{travelStats.savedPlaces}</p>
                        <p className="text-sm text-muted-foreground">Saved Places</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions & Upcoming Trips */}
                <Tabs defaultValue="actions" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="actions">Quick Actions</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="actions" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Manage Your Travel</CardTitle>
                        <CardDescription>Quick access to common actions</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/" className="w-full">
                          <Button
                            variant="default"
                            className="w-full flex items-center justify-center gap-2 h-auto py-6"
                          >
                            <PlusCircle className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Create New Itinerary</div>
                              <div className="text-xs text-primary-foreground/80">Plan your next adventure</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/profile/itineraries" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-auto py-6"
                          >
                            <MapPin className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">View Itineraries</div>
                              <div className="text-xs text-muted-foreground">See all your travel plans</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/profile/preferences" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-auto py-6"
                          >
                            <Heart className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Travel Preferences</div>
                              <div className="text-xs text-muted-foreground">Update your interests</div>
                            </div>
                          </Button>
                        </Link>
                        <Link href="/profile/payment" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-auto py-6"
                          >
                            <CreditCard className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Payment Methods</div>
                              <div className="text-xs text-muted-foreground">Manage your payment options</div>
                            </div>
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Trips</CardTitle>
                        <CardDescription>Your next adventures</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {upcomingTrips.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingTrips.map((trip) => (
                              <div
                                key={trip.id}
                                className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border"
                              >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Plane className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{trip.destination}</h3>
                                  <p className="text-sm text-muted-foreground">{trip.date}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-blue-500">In {trip.daysUntil} days</div>
                                  <Link href={`/itinerary/${trip.id}`}>
                                    <Button variant="ghost" size="sm" className="mt-1">
                                      View
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <p className="text-muted-foreground mb-4">No upcoming trips planned</p>
                            <Link href="/">
                              <Button>Plan a Trip</Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-center border-t pt-4">
                        <Link href="/itineraries">
                          <Button variant="outline">View All Trips</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

