import React from 'react'
import Image from 'next/image'


const nav = () => {
  return (
    <div className='flex justify-between items-center p-4 bg-white'>
        <div className='flex gap-5'>
            <Image src={'/logo.png'} alt='image' width={50} height={50} className='inline'></Image>
            <h1 className='px-10 bold text-[#000000] text-[20px] mt-2 '>Admin</h1>
        </div>
        <div className='flex gap-5'>
            <div>
                 <input type="text" className=' ' />
            </div>
            <div>
            <Image src={'./bell.svg'} width={30} height={30} alt='logi'></Image>

            </div>
            <div>
            <Image src={'./profile.svg'} className=' rounded-full' width={30} height={30} alt='logi'></Image>

            </div>


        </div>

    </div>
  )
}

export default nav