"use client"
import { Book } from "@/type/Book";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { useEffect, useState } from "react";
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

// Sanity query to fetch a single book by slug
const bookQuery = groq`*[_type == "book" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  formatsAvailable,
  publishedDate,
  author,
  image,
  bookLink,
  description,
  readSample,
  sample
}`;

export default function BookDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await client.fetch(bookQuery, { slug });
        setBook(data);
      } catch (err) {
        setError('Failed to fetch book details');
        console.error('Error fetching book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  if (isLoading) {
    return <p className="text-center text-gray-200 mt-10 text-xl">Loading...</p>;
  }

  if (error || !book) {
    return <p className="text-center text-red-500 mt-10 text-xl">Book not found</p>;
  }

  return (
    <section className="bg-[#1e1b2e] text-white py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        
        {/* Book Image */}
        {book.image && (
          <div className="w-full md:w-[300px] h-[400px] relative">
            <Image
              src={urlFor(book.image).url()}
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
            <p className="text-gray-400">{new Date(book.publishedDate).toLocaleDateString()}</p>
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-300">Formats Available:</h2>
            <p className="text-gray-400">{book.formatsAvailable.join(", ")}</p>
          </div>

          {(book.sample || book.readSample) && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">About the Book</h2>
              <h3 className="text-lg text-gray-200 mb-1">{(book.sample || book.readSample)?.title}</h3>
              <div className="text-gray-400 leading-relaxed">
                <PortableText value={(book.sample || book.readSample)?.content || []} />
              </div>
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
          <h2 className="text-2xl font-bold text-white mb-2">Read Sample</h2>
          <div className="text-gray-300 leading-relaxed">
            <PortableText value={book.description} />
          </div>
        </div>
      </div>
    </section>
  );
}
