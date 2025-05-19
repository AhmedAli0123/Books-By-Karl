import React from 'react'
import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/ImageSlider'
import Footer from '@/components/Footer'
import ContactPage from '@/components/ContectForm'
import BookSection from '@/components/BookSection'

function page() {
  return (
    <>
    <section className='bg-[#252231]'>
      <HeroCarousel />
      <BookSection />
      <ContactPage />
      </section>
    </>
  )
}

export default page