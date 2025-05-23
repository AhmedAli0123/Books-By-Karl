"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

const images = ["/banner/banner1.jpg", "/banner/banner2.jpg", "/banner/banner3.jpg", "/banner/banner4.jpg"]

const HeroCarousel = () => {
  return (
    <div className="max-w-6xl mx-auto pt-5 md:px-4 py-3">
      <Carousel 
        className="relative w-full"
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem
              key={index}
              className="w-full"
            >
              <div className="relative w-full h-[200px]  md:h-[400px] lg:h-[500px]">
                <Image
                  src={src}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-fill rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 70vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  )
}

export default HeroCarousel
