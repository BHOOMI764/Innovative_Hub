'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, Code, Globe, Award, Users, ArrowRight, Star, Github, Linkedin, Twitter } from "lucide-react"
import { Project, Testimonial, LeaderboardEntry, PaginatedResponse } from '@/lib/api';
import api from '@/lib/api';

// Sample data for featured projects
const featuredProjects = [
  {
    id: 1,
    title: "Interactive Climate Change Visualization",
    authors: [{ first_name: "Team", last_name: "EcoViz" }],
    thumbnail: "/placeholder.svg?height=200&width=350",
    sdgs: ["Climate Action", "Quality Education"],
    rating: 4.9,
  },
  {
    id: 2,
    title: "Sustainable City Simulator",
    authors: [{ first_name: "Urban", last_name: "Planners" }],
    thumbnail: "/placeholder.svg?height=200&width=350",
    sdgs: ["Sustainable Cities", "Innovation"],
    rating: 4.7,
  },
  {
    id: 3,
    title: "Ocean Cleanup Game",
    authors: [{ first_name: "Blue", last_name: "Team" }],
    thumbnail: "/placeholder.svg?height=200&width=350",
    sdgs: ["Life Below Water", "Responsible Consumption"],
    rating: 4.8,
  },
  {
    id: 4,
    title: "Renewable Energy Dashboard",
    authors: [{ first_name: "Green", last_name: "Power" }],
    thumbnail: "/placeholder.svg?height=200&width=350",
    sdgs: ["Affordable Clean Energy", "Climate Action"],
    rating: 4.6,
  },
]

// Sample data for testimonials
const testimonials = [
  {
    id: 1,
    content: "This platform helped me showcase my coding skills to potential employers. I received two job offers after publishing my project!",
    author: { first_name: "Alex", last_name: "Chen" },
    rating: 5,
  },
  {
    id: 2,
    content: "As a faculty coordinator, I've seen tremendous growth in student engagement since we started using this platform. The SDG mapping adds real-world context to their work.",
    author: { first_name: "Dr. Sarah", last_name: "Johnson" },
    rating: 5,
  },
  {
    id: 3,
    content: "We've hired three talented developers we discovered through this platform. The quality of projects and alignment with our sustainability goals has been impressive.",
    author: { first_name: "Michael", last_name: "Rodriguez" },
    rating: 5,
  },
]

// Sample data for leaderboard
const leaderboardProjects = [
  {
    id: 1,
    project: {
      title: "AI for Sustainable Farming",
      authors: [{ first_name: "AgriTech", last_name: "Innovators" }],
    },
    score: 98,
  },
  {
    id: 2,
    project: {
      title: "Virtual Water Conservation Lab",
      authors: [{ first_name: "Blue", last_name: "Drop" }],
    },
    score: 95,
  },
  {
    id: 3,
    project: {
      title: "Inclusive Education Platform",
      authors: [{ first_name: "EduFor", last_name: "All" }],
    },
    score: 92,
  },
]

export default function Home() {
  const [projects, setProjects] = useState<PaginatedResponse<Project>>({ count: 0, next: null, previous: null, results: [] });
  const [testimonials, setTestimonials] = useState<PaginatedResponse<Testimonial>>({ count: 0, next: null, previous: null, results: [] });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data in parallel with error handling for each request
        const [projectsData, testimonialsData, leaderboardData] = await Promise.allSettled([
          api.getProjects(),
          api.getTestimonials(),
          api.getTopProjects(),
        ]);

        if (mounted) {
          if (projectsData.status === 'fulfilled') {
            setProjects(projectsData.value);
          }
          if (testimonialsData.status === 'fulfilled') {
            setTestimonials(testimonialsData.value);
          }
          if (leaderboardData.status === 'fulfilled') {
            setLeaderboard(leaderboardData.value);
          }
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load data. Please try again later.');
          console.error('Error fetching data:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const renderAuthors = (authors: Project['authors']) => {
    return authors.map(author => `${author.first_name} ${author.last_name}`).join(', ');
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Innovate HUB</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/projects" className="text-sm font-medium transition-colors hover:text-primary">
              Projects
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/sdgs" className="text-sm font-medium transition-colors hover:text-primary">
              SDGs
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm">
                Log In
              </Button>
              <Button size="sm">Sign Up</Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Showcase Your Innovation
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A platform for students to showcase their innovative projects and connect with industry professionals
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary">
              Explore Projects
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10">
              Submit Your Project
            </Button>
          </div>
        </section>

        {/* About the Platform */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">About the Platform</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The Creative Coding Showcase Platform connects student projects with the global sustainability agenda,
                providing a space for innovation, learning, and meaningful impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 neon-border">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Showcase your projects, build a portfolio, receive feedback from experts, and connect with potential
                    employers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 neon-border">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>For Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Mentor students, review projects, track progress, and facilitate connections with industry partners.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 neon-border">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>SDG Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Projects are mapped to Sustainable Development Goals, fostering awareness and contributing to global
                    sustainability efforts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <p>Loading...</p>
              ) : (
                projects.results.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <p className="text-sm text-gray-500">{renderAuthors(project.authors)}</p>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.sdgs.map((sdg: string) => (
                          <Badge key={sdg} variant="secondary">
                            {sdg}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span>{project.rating}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform makes it easy to explore, showcase, and collaborate on creative coding projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Explore & Discover",
                  description: "Browse projects by SDGs & categories",
                  icon: Search,
                },
                {
                  step: 2,
                  title: "Submit & Showcase",
                  description: "Students upload projects & map SDGs",
                  icon: Code,
                },
                {
                  step: 3,
                  title: "Engage & Collaborate",
                  description: "Give feedback, rate projects & connect",
                  icon: Users,
                },
                {
                  step: 4,
                  title: "Grow & Get Recognized",
                  description: "Earn rankings & industry opportunities",
                  icon: Award,
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 scale-150" />
                    <div className="relative bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold neon-box">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  <item.icon className="mt-4 h-8 w-8 text-primary/60" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard & Recognition */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Project Leaderboard</h2>
            <div className="space-y-4">
              {loading ? (
                <p>Loading...</p>
              ) : (
                leaderboard.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-blue-600">{entry.score}</span>
                        <div>
                          <h3 className="font-semibold">{entry.project.title}</h3>
                          <p className="text-sm text-gray-500">{renderAuthors(entry.project.authors)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">What People Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? (
                <p>Loading...</p>
              ) : (
                testimonials.results.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-gray-600 dark:text-gray-300">
                            {testimonial.content}
                          </p>
                          <div className="mt-4">
                            <h3 className="font-semibold">
                              {testimonial.author.first_name} {testimonial.author.last_name}
                            </h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{testimonial.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Join the Community */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 neon-glow">Join Our Creative Coding Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with students, faculty, and industry experts. Showcase your projects and make a positive impact
              through creative coding.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="gap-2 neon-box">
                Sign Up Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 neon-border">
                Start Exploring
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              A platform dedicated to showcasing student innovations and connecting them with opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-white">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-400 hover:text-white">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: info@example.com</li>
              <li className="text-gray-400">Phone: (123) 456-7890</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Innovation Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

