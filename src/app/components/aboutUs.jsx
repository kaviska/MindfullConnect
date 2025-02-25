import React from 'react'

const AboutUs = () => {
  return (
    <div>
      <section
        id="features"
       className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-900 bg-neutral-900/30 my-20 mx-auto max-w-7xl z-10 grid grid-cols-1 gap-4 pt-14 sm:grid-cols-2 lg:grid-cols-2"
       >
        <div className="relative mx-auto max-w-2xl text-center bg-slate-900">
          <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent  my-3 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider">
            About Us
          </h1>

         
          
        </div>
        <div className="relative mx-auto max-w-2xl text-center bg-slate-900">
          <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent  my-3 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider">
            About Us
          </h1>

         
          
        </div>

        
        
      </section>
    </div>
  )
}
const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl bg-[#16354a] p-8 text-center shadow transition duration-300 hover:bg-[#1f4865]">
      <div
        className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border transition duration-300 hover:scale-110"
        style={{
          backgroundImage:
            "linear-gradient(rgb(206, 206, 219) 0%, rgb(10, 73, 121) 100%)",
          borderColor: "rgb(87, 87, 94)",
        }}
      >
        {icon}
      </div>
      <h3 className="mt-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent \">
        {title}
      </h3>
      <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent ">
        {description}
      </p>
    </div>
  );
};

export default AboutUs;
