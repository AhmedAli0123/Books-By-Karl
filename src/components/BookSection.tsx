import Image from "next/image";
import Link from "next/link";
import book1 from "@/../public/books/book1.jpg";

const BookSection = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat my-10"
      style={{
        backgroundImage: "url('/nature-forest-trees-fog.jpeg')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
        <h2 className="text-4xl font-bold mb-10 text-center drop-shadow-md">
          📚 Featured Book
        </h2>

        <div className="flex flex-col md:flex-row-reverse items-center gap-10 p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg">
          {/* Book Image */}
          <div className="w-full md:w-[45%] flex justify-center">
            <div className="w-[300px] sm:w-[350px] h-auto">
              <Image
                src={book1}
                alt="Book Cover"
                width={350}
                height={500}
                loading="lazy"
                className="rounded-lg object-contain w-full h-auto"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="w-full md:w-[60%] text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-green-300 drop-shadow-sm">
              Living the Dreams: A Journey to Success and Fulfillment
            </h3>
            <p className="text-sm sm:text-base font-medium mb-2 text-gray-200">
              <strong className="text-white">Release Date:</strong> 2025-04-08
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-line">
              Meet Karl Nystrom, a seasoned entrepreneur and author with a life story that reads like a thrilling adventure novel...
            </p>
            <Link
              href="/books"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-green-700 transition drop-shadow"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
