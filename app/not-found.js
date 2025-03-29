// ------------ Components ----------------
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <section id="not-found" className="py-24">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <Image 
              src='not-found.svg' // The image file to be displayed
              width={300} // Set the width of the image
              height={300} // Set the height of the image
              alt='not found image' // Alt text for the image for accessibility
              className="rounded-xl object-cover w-full h-96 lg:h-auto" // Image styling with rounded corners and responsive sizing
            />
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 lg:pl-16 mt-12 lg:mt-0 text-center lg:text-left">
            <h2 className="text-5xl font-extrabold text-primary mb-6 leading-tight">
              404 - Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Oops! It seems like the page you're looking for doesn't exist. 
              <span className="text-primary font-bold">
                Magic Touch
              </span>
              is here to help you find your way back.
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Don't worry, you can always return to our homepage and explore our services. 
              We're here to make your home a better place.
            </p>
            {/* Call to Action Button */}
            <Link
              href="/" // The link will navigate to the homepage
              className="inline-block bg-primary text-white text-lg font-semibold py-3 px-8 rounded-lg hover:bg-blue-500 transition duration-300"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;