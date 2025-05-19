import Image from "next/image";

export default function AuthorSection() {
  return (
    <section className="px-6 py-10 bg-[#252231]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 mb-8">
        {/* Text and Image Row */}
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold text-white">About the Author: Karl Nystrom (Carlo de Luca)</h1>
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Finnish Entrepreneur | Adventure Author | Global Innovator</h3>
          <p className="text-gray-50 leading-relaxed text-justify">
            Born on October 8, 1954, in Parainen, a picturesque town nestled in
            the southwest of Finland, Karl Nystrom (writing under the pen name
            Carlo de Luca) has led a life defined by adventure, innovation, and a
            relentless entrepreneurial spirit. Growing up amid the rugged beauty
            of the Finnish landscape, Karl’s early years were shaped by the
            simplicity of small-town life and the steady influence of family.
          </p>
        </div>

        {/* Author Image */}
        <div className=" md:w-1/3 flex justify-center h-[412px] w-[275px]">
          <Image
            src="/author.jpg"
            alt="Karl Nystrom"
            width={275}
            height={412}
            className="rounded-xl shadow-md object-cover"
          />
        </div>
      </div>

      {/* Second Paragraph */}
      <div className="max-w-4xl mx-auto">

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
          After completing high school, the Finnish entrepreneur pursued a
          technical education and became a skilled car mechanic, gaining
          hands-on experience in his father’s garage. His early passion for
          mechanics and engineering soon evolved into a broader entrepreneurial
          journey. After serving in the Finnish Army, Karl began importing
          American cars and motorcycles into Finland, an endeavor that sparked a
          series of ventures spanning continents and industries.
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        In the 1980s, Karl founded a company that became one of Finland’s largest importers of U.S.
auto parts. His success and vision in the auto trade earned him recognition across the globe.
From importing Royal Enfield motorcycles and new cars into Finland to pioneering
collaborations on early breast cancer detection technologies and color-changing apparel, Karl
consistently stayed ahead of the curve as an innovative businessman
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        A turning point came when Karl ventured into the Russian automotive market, becoming one of
the first to import Ford Lincoln Town Cars into Moscow in the late 1980s. This bold move led to
the opening of offices in Antwerp and a partnership with a European pop artist that produced
chart-topping singles in Germany and Belgium.
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        Fuelled by a lifelong thirst for exploration, Karl embarked on a sailing adventure across the
Atlantic Ocean, where he braved a typhoon and numerous challenges. His Mediterranean sailing
stories, combined with motorcycle travels through Turkey on a Harley-Davidson, were later
published in European magazines, marking the beginning of his writing career.
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        After relocating to Spain and the United States, Karl continued to innovate, opening a successful
hotel in the Philippines and later building a five-star resort on a remote Pacific island, where his
reputation as a global entrepreneur reached new heights
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        But beyond his business ventures, Karl rediscovered his true passion: storytelling. Following the
loss of his first manuscript, he returned to writing and has since authored eight books under the
name Carlo de Luca. His works reflect the adventurous life he&apos;s led and aim to inspire readers to
pursue their own dreams with courage and resilience.
        </p>

        <p className="text-gray-50 leading-relaxed text-justify mb-4">
        Today, Karl Nystrom divides his time between Finland, Spain, and the Philippines, continuing to
explore new frontiers in both business and literature. His philosophy is simple yet powerful:
success doesnt come without failure, but through perseverance, greatness is within reach
        </p>

      </div>
    </section>
  );
}
