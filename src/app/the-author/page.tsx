import React from 'react'
import AuthorSection from './component/Author'
import PressBiograghpy from './component/PressBiograghpy'
import PhotoGallery from './component/PhotoGallery'


function page() {
  return (
    <>
    <div className='bg-[#252231]'>
        <AuthorSection />
        <PressBiograghpy />
        <div className='bg-[#252231] py-10'>
        <PhotoGallery />
        </div>
        </div>
    </>
  )
}

export default page