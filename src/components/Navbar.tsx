"use client"

import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu, Search, Clock, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"

const links = [
  "Books",
  "The Author",
  "News",
  "FAQ",
  "Contact"
]

// Query to get all book titles for suggestions
const booksQuery = groq`*[_type == "book"] {
  name,
  slug
}`

// Separate component for search functionality
function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<{ name: string; slug: { current: string } }[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch book titles for suggestions
  useEffect(() => {
    const fetchBooks = async () => {
      const books = await client.fetch(booksQuery)
      setSuggestions(books)
    }
    fetchBooks()
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      } 
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update search value from URL
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setSearchValue(search)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    
    // Save to recent searches
    if (search) {
      const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 3)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    }
    
    router.push(`/books?search=${encodeURIComponent(search)}`)
    setShowSuggestions(false)
    setSearchValue('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/books?search=${encodeURIComponent(suggestion)}`)
    setShowSuggestions(false)
    setSearchValue('')
  }

  const filteredSuggestions = suggestions.filter(book =>
    book.name.toLowerCase().includes(searchValue.toLowerCase())
  ).slice(0, 3)

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <Input
          name="search"
          placeholder="Search books..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          className="h-9 bg-background"
        />
      </form>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (searchValue || recentSearches.length > 0) && (
        <div className="absolute w-full mt-1 bg-background border rounded-md shadow-md">
          {searchValue && filteredSuggestions.length > 0 && (
            <div className="p-1">
              {filteredSuggestions.map((book) => (
                <button
                  key={book.slug.current}
                  onClick={() => handleSuggestionClick(book.name)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center gap-2"
                >
                  <Book className="w-4 h-4" />
                  {book.name}
                </button>
              ))}
            </div>
          )}
          
          {recentSearches.length > 0 && (
            <div className="p-1 border-t">
              <div className="text-xs text-muted-foreground px-2 py-1.5">Recent</div>
              {recentSearches.slice(0, 3).map((search: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  return (
    <header className="bg-[#252231] w-full shadow-sm bg-background/50 sticky top-0 backdrop-blur z-10 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="font-bold tracking-tight">
          <h1 className="text-lg md:text-3xl font-greatvibes">Books By </h1>
          <h1 className="text-center text-lg md:text-4xl font-greatvibes">Karl</h1>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {links.map((link: string) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-base font-semibold text-gray-700 hover:text-white hover:bg-red-500 px-2 py-2 rounded-md transition-all duration-200"
            >
              {link}
            </Link>
          ))}
          <div className="hidden lg:block w-64">
            <Suspense fallback={<Input placeholder="Loading..." disabled />}>
              <SearchBar />
            </Suspense>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-10 h-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="font-bold tracking-tight">
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
                <div className="mt-4">
                  <Suspense fallback={<Input placeholder="Loading..." disabled />}>
                    <SearchBar />
                  </Suspense>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
