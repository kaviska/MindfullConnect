import * as React from 'react';



const FeaturesSection = () => {
  return (
    <div className="bg-sky-600 " >
      <section
        id="features"
        className="relative block px-6 py-10 md:py-20 md:px-10 border-t border-b border-neutral-900 bg-neutral-900/30"
       >
        <div className="relative mx-auto max-w-5xl text-center">
        <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent  my-3 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider">
        Why choose us
        </h1>

          <h2 className="block w-full bg-gradient-to-b from-white to-gray-400  bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
            Build a Website That Your Customers Love
          </h2>
          <p className="mx-auto my-4 w-full max-w-xl bg-transparent text-center font-medium leading-relaxed tracking-wide text-gray-400">
            Our templates allow for maximum customization. No technical skills required – our intuitive design tools let
            you get the job done easily.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative mx-auto max-w-7xl z-10 grid grid-cols-1 gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature Item 1 */}
          <FeatureItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-color-swatch"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2"></path>
                <path d="M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9"></path>
                <path d="M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12"></path>
                <line x1="17" y1="17" x2="17" y2="17.01"></line>
              </svg>
            }
            title="Customizable"
            description="Tailor your landing page's look and feel, from the color scheme to the font size, to the design of the page."
          />

          {/* Feature Item 2 */}
          <FeatureItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-bolt"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <polyline points="13 3 13 10 19 10 11 21 11 14 5 14 13 3"></polyline>
              </svg>
            }
            title="Fast Performance"
            description="We build our templates for speed in mind, for super-fast load times so your customers never waver."
          />

          {/* Feature Item 3 */}
          <FeatureItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-tools"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4"></path>
                <line x1="14.5" y1="5.5" x2="18.5" y2="9.5"></line>
                <polyline points="12 8 7 3 3 7 8 12"></polyline>
                <line x1="7" y1="8" x2="5.5" y2="9.5"></line>
                <polyline points="16 12 21 17 17 21 12 16"></polyline>
                <line x1="16" y1="17" x2="14.5" y2="18.5"></line>
              </svg>
            }
            title="Fully Featured"
            description="Everything you need to succeed and launch your landing page, right out of the box. No need to install anything else."
          />
        </div>

        {/* Gradient Backgrounds */}
        <div
          className="absolute bottom-0 left-0 z-0 h-1/3 w-full border-b"
          style={{
            backgroundImage:
              "linear-gradient(to right top, rgba(79, 70, 229, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(92, 79, 240, 0.2)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-0 z-0 h-1/3 w-full"
          style={{
            backgroundImage:
              "linear-gradient(to left top, rgba(220, 38, 38, 0.2) 0%, transparent 50%, transparent 100%)",
            borderColor: "rgba(61, 58, 94, 0.2)",
          }}
        ></div>
        
      </section>
    </div>
  );
};

// Feature Item Component
const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900/50 p-8 text-center shadow">
      <div
        className="button-text mx-auto flex h-12 w-12 items-center justify-center rounded-md border"
        style={{
          backgroundImage: "linear-gradient(rgb(206, 206, 219) 0%, rgb(55, 111, 151) 100%)",
          borderColor: "rgb(87, 87, 94)",
        }}
      >
        {icon}
      </div>
      <h3 className="mt-6 text-gray-400">{title}</h3>
      <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">{description}</p>
    </div>
  );
};


export default FeaturesSection;
