import React from 'react'

const Navbar = () => {
  return (
    <div className='max-w-screen-2xl mx-auto container px-4 md:px-40 shadow-lg h-16 bg-gray-800 text-gray-200'>
      <div className='flex justify-between items-center h-full'>
        <h1 className='text-xl sm:text-2xl cursor-pointer text-base font-bold'>
          Word<span className='text-green-500 text-2xl sm:text-3xl'>To</span>PDF
        </h1>

        {/* Home link always visible */}
        <h1 className='text-base sm:text-xl cursor-pointer font-bold hover:scale-110 duration-200'>
          Home
        </h1>
      </div>
    </div>
  )
}

export default Navbar
