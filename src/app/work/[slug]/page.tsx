"use client"
import Books from "@/data/Books.json";
import { Book } from "@/type/Book";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function BookDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const book = Books.books.find((b: Book) => b.slug === slug);

  if (!book) {
    return <p className="text-center text-red-500 mt-10 text-xl">Book not found</p>;
  }

  return (
    <section className="bg-[#1e1b2e] text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        
        {/* Book Image */}
        {book.image && (
          <div className="w-full md:w-[300px] h-[400px] relative">
            <Image
              src={book.image}
              alt={book.name}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Book Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-4">{book.name}</h1>

          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-300">Published Date:</h2>
            <p className="text-gray-400">{book.publishedDate}</p>
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-300">Formats Available:</h2>
            <p className="text-gray-400">{book.formatsAvailable.join(", ")}</p>
          </div>

          {(book.sample || book.readSample) && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Read a Sample</h2>
            <h3 className="text-lg text-gray-200 mb-1">{(book.sample || book.readSample)?.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {(book.sample || book.readSample)?.content}
            </p>
          </div>
        )}

          <div className="mt-6">
            <Link
              href={book.bookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Buy on Amazon
            </Link>
          </div>
        </div>
      </div>

      {/* Book Content Section */}
      <div className="mt-12 max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">About the Book</h2>
          <p className="text-gray-300 leading-relaxed">{book.description}</p>
        </div>

        
      </div>
    </section>
  );
}
