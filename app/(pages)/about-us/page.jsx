// ------------ Components ----------------
import Image from 'next/image';

const AboutUs = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <Image 
              src='/about-us.svg' // The image file to be displayed
              width={300} // Set the width of the image
              height={300} // Set the height of the image
              alt='about image' // Alt text for the image for accessibility
              className="rounded-xl object-cover w-full h-96 lg:h-auto" // Image styling with rounded corners and responsive sizing
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 lg:pl-16 mt-12 lg:mt-0 text-center lg:text-left">
            <h2 className="text-5xl font-extrabold text-primary mb-6 leading-tight">
              About Us
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              At 
              <span className="text-primary font-bold">
                Magic Touch
              </span>
              , we’re passionate about making your home a better place to live. With our comprehensive home
              services, we offer everything from maintenance, repair, to remodeling solutions. Our 
              mission is to provide the highest quality work, unparalleled customer service, and 
              results that exceed your expectations.
            </p>
            <p className="text-lg text-gray-500 mb-8">
              We believe that every home deserves care and attention, and our expert team is 
              here to bring your vision to life. Let us transform your space with dedication 
              and precision.
            </p>
            {/* Call to Action Button */}
            <a
              href="#contact" // The link will navigate to the contact section
              className="inline-block bg-primary text-white text-lg font-semibold py-3 px-8 rounded-lg hover:bg-blue-500 transition duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
