"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Book } from "@/type/Book";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

export default function EditBook() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNewBook = slug === "new";

  const [book, setBook] = useState<Partial<Book>>({
    _type: "book",
    name: "",
    author: "",
    formatsAvailable: [],
    publishedDate: new Date().toISOString().split("T")[0],
    bookLink: "",
    description: [],
    readSample: {
      chapter: "",
      title: "",
      content: []
    },
    sample: {
      title: "",
      content: []
    },
    slug: {
      _type: "slug",
      current: ""
    }
  });

  const [isLoading, setIsLoading] = useState(!isNewBook);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewBook) {
      const fetchBook = async () => {
        try {
          const data = await client.fetch(
            groq`*[_type == "book" && slug.current == $slug][0]`,
            { slug }
          );
          if (data) {
            setBook(data);
          }
        } catch (error) {
          console.error("Error fetching book:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBook();
    } else {
      setIsLoading(false);
    }
  }, [slug, isNewBook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const bookData = {
        _type: "book",
        ...book,
        slug: {
          _type: "slug",
          current: book.name?.toLowerCase().replace(/\s+/g, "-"),
        },
      };

      if (isNewBook) {
        await client.create(bookData);
      } else {
        if (!book._id) {
          throw new Error("Book ID is missing");
        }
        await client
          .patch(book._id)
          .set(bookData)
          .commit();
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error saving book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1b2e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1b2e] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNewBook ? "Add New Book" : "Edit Book"}
          </h1>
          <p className="text-gray-400">
            {isNewBook ? "Create a new book entry" : "Update book information"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Book Title
                </label>
                <input
                  type="text"
                  value={book.name}
                  onChange={(e) => setBook({ ...book, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  placeholder="Enter book title"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Author
                </label>
                <input
                  type="text"
                  value={book.author}
                  onChange={(e) => setBook({ ...book, author: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Published Date
                </label>
                <input
                  type="date"
                  value={book.publishedDate}
                  onChange={(e) => setBook({ ...book, publishedDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Book Link
                </label>
                <input
                  type="url"
                  value={book.bookLink}
                  onChange={(e) => setBook({ ...book, bookLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  placeholder="https://example.com/book"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Formats Available
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Ebook", "Paperback", "Hardcover"].map((format) => (
                <label
                  key={format}
                  className="flex items-center p-3 rounded-lg border border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={book.formatsAvailable?.includes(format)}
                    onChange={(e) => {
                      const formats = book.formatsAvailable || [];
                      setBook({
                        ...book,
                        formatsAvailable: e.target.checked
                          ? [...formats, format]
                          : formats.filter((f) => f !== format),
                      });
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-[#1e1b2e] text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-300">{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Description
            </label>
            <div className="border border-gray-600 rounded-lg bg-[#1e1b2e] overflow-hidden">
              <RichTextEditor
                value={book.description || []}
                onChange={(value) => setBook({ ...book, description: value })}
              />
            </div>
          </div>

          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Read Sample
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Chapter
                  </label>
                  <input
                    type="text"
                    value={book.readSample?.chapter || ""}
                    onChange={(e) => setBook({
                      ...book,
                      readSample: {
                        chapter: e.target.value,
                        title: book.readSample?.title || "",
                        content: book.readSample?.content || []
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter chapter number or name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={book.readSample?.title || ""}
                    onChange={(e) => setBook({
                      ...book,
                      readSample: {
                        chapter: book.readSample?.chapter || "",
                        title: e.target.value,
                        content: book.readSample?.content || []
                      }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter read sample title"
                  />
                </div>
              </div>
              <div className="border border-gray-600 rounded-lg bg-[#1e1b2e] overflow-hidden">
                <RichTextEditor
                  value={book.readSample?.content || []}
                  onChange={(value) => setBook({
                    ...book,
                    readSample: {
                      chapter: book.readSample?.chapter || "",
                      title: book.readSample?.title || "",
                      content: value
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Sample
            </label>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={book.sample?.title || ""}
                  onChange={(e) => setBook({
                    ...book,
                    sample: {
                      title: e.target.value,
                      content: book.sample?.content || []
                    }
                  })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1b2e] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter sample title"
                />
              </div>
              <div className="border border-gray-600 rounded-lg bg-[#1e1b2e] overflow-hidden">
                <RichTextEditor
                  value={book.sample?.content || []}
                  onChange={(value) => setBook({
                    ...book,
                    sample: {
                      title: book.sample?.title || "",
                      content: value
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#252231] rounded-xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Book Cover Image
            </label>
            <div className="space-y-4">
              {book.image && (
                <div className="relative w-48 h-64">
                  <Image
                    src={urlFor(book.image).url()}
                    alt={book.name || ""}
                    width={300}
                    height={400}
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await response.json();
                        if (data.url) {
                          setBook({ 
                            ...book, 
                            image: {
                              _type: "image",
                              asset: {
                                _type: "reference",
                                _ref: data.url
                              }
                            }
                          });
                        }
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        alert('Error uploading image. Please try again.');
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    file:cursor-pointer
                    cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-6 py-2.5 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
