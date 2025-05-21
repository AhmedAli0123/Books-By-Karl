

import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const links = [
  "Books",
  "The Author",
  "News",
  "FAQ",
  "Contact"
]

export default function Navbar() {

  return (
    <header className="bg-[#252231] w-full shadow-sm bg-background/50 sticky top-0  backdrop-blur z-10 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 ">
        {/* Logo */}
        <Link href="/" className=" font-bold tracking-tight" >
          <h1 className="text-lg md:text-3xl font-greatvibes">Books By </h1>
          <h1 className="text-center text-lg md:text-4xl font-greatvibes">Karl</h1>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {links.map((link:string) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-base font-semibold text-gray-700 hover:text-white hover:bg-red-500 px-2 py-2 rounded-md transition-all duration-200"
            >
              {link}
            </Link>
          ))}
                <div className="hidden lg:block w-1/4">
          <Input placeholder="Search books..." />
        </div>
        </nav>

                {/* Search Bar */}


        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-10 h-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                {/* Logo */}
        <Link href="/" className=" font-bold tracking-tight">
          <h1 className="text-3xl text-center">Books By Karl</h1>
        </Link>
              <div className="flex flex-col gap-3 mt-6">
                {links.map((link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-base font-semibold text-gray-700 hover:text-white hover:bg-red-500 px-4 py-2 rounded-full transition-all duration-200"
                  >
                    {link}
                  </Link>
                ))}
                <Input placeholder="Search books..." className="mt-4" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
