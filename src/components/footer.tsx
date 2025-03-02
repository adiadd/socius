import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tighter">AnthroBench</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Advancing AI evaluation by focusing on humanity&apos;s challenges.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research" className="text-muted-foreground hover:underline">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/benchmarks" className="text-muted-foreground hover:underline">
                  Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:underline">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:underline">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:underline">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="text-muted-foreground hover:underline">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AnthroBench. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

