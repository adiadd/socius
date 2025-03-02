import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About AnthroBench</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our mission is to advance AI evaluation by focusing on humanity&apos;s challenges.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl gap-8 py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Story</h2>
                <p className="text-muted-foreground">
                  AnthroBench was founded with a clear vision: to move beyond traditional AI metrics and create
                  evaluation frameworks that assess AI systems&apos; ability to think critically, ethically, and
                  collaboratively when addressing real-world human issues.
                </p>
                <p className="text-muted-foreground">
                  We believe that true intelligence isn&apos;t just about solving mathematical problems or generating
                  coherent text—it&apos;s about understanding and addressing the complex challenges that humanity faces.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Philosophy</h2>
                <p className="text-muted-foreground">
                  At the core of our work is the belief that AI should be developed to genuinely serve humanity&apos;s
                  needs. This means creating benchmarks that evaluate AI systems on their ability to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Understand complex human challenges with nuance and context</li>
                  <li>Consider ethical implications and potential consequences</li>
                  <li>Collaborate effectively with humans to solve problems</li>
                  <li>Adapt to diverse cultural contexts and perspectives</li>
                  <li>Prioritize human well-being and dignity</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Approach</h2>
                <p className="text-muted-foreground">
                  AnthroBench develops comprehensive evaluation methodologies that measure what truly matters: AI&apos;s
                  capacity to understand, respond to, and help resolve complex human challenges with nuance, empathy,
                  and ethical consideration.
                </p>
                <p className="text-muted-foreground">
                  Our benchmarks are designed to be rigorous, transparent, and accessible to researchers, developers,
                  and organizations working on AI systems.
                </p>
              </div>
              <div className="flex justify-center pt-8">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/research">
                    Explore Our Research <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

