import Image from "next/image";
import Link from "next/link";
import book1 from "@/../public/books/book1.jpg";

const BookSection = () => {
  return (
    <section 
    style={{ 
      backgroundImage: "url('/forest-background.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20" >
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-800">
        Featured Book
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-10 p-6 rounded-xl shadow-lg">
        {/* Book Image */}
        <div className="w-full md:w-[45%] flex justify-center">
          <div className="w-[300px] sm:w-[350px] h-auto">
            <Image
              src={book1}
              alt="Book Cover"
              width={350}
              height={500}
              className="rounded-lg object-contain w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="w-full md:w-[60%] text-gray-600">
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3 text-[#DE3E16]">
            Living the Dreams: A Journey to Success and Fulfillment. Make Your
            Dreams a Reality
          </h3>
          <p className="text-sm sm:text-base font-medium mb-2 text-gray-600">
            <strong>Release Date:</strong> 2025-04-08
          </p>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            Meet Karl Nystrom, a seasoned entrepreneur and author with a life
            story that reads like a thrilling adventure novel. His memoir,
            Living the Dreams, is a true account of his journey from day one to
            the present, packed with lessons learned and wisdom gained.\n\nWith
            a diverse career spanning the automotive and real estate industries.
            Karl has also held key positions in various companies, including
            Director and Secretary for a prominent English firm, CEO in Hong
            Kong for electronics export, and hotel owner. His entrepreneurial
            spirit has led him to explore multiple ventures, from constructing
            hotels in the Philippines to importing products for renewable
            energy.\n\nAs an Author, Karl&apos;s writing spans multiple genres,
            including motorcycles, cars, cyber-crimes and food. With many more
            books in the pipeline, his readers can expect a wide range of topics
            and inspiration.\n\nKarl's story is a testament to the power of
            determination, hard work, and a passion for living the life to
            fullest. Through his writing, he aims to inspire and motivate others
            to chase their dreams and never give up.
          </p>
          <Link
            href="/books"
            className="inline-block bg-[#DE3E16] text-white px-6 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-gray-800 transition"
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
