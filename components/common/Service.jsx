// ------------ Icons ----------------
import { Clock } from "lucide-react";
// ------------ Components ----------------
import { Button } from "../ui/shadcn/button";
import Image from "next/image";
import Link from "next/link";

const Service = ({ service }) => {
  return (
    <div className="hover:shadow-primary hover:shadow-sm bg-background-color shadow-md mt-9 cursor-pointer transition-all duration-300 ease-in-out !rounded-lg">
      {/* Wraps the entire service card with a clickable link */}
      <Link href={`/services/service?service-name=${service?.name}&category=${service?.category}`}>
        {/* Displays the service image */}
        <Image
          className="w-full h-[200px] object-cover rounded-lg"
          src={service?.image?.url}
          alt="service image"
          width={300}
          height={200}
        />

        <span className="flex flex-col items-baseline p-3 gap-1">
          {/* Displays the service category in a styled label */}
          <h2 className="p-1 font-semibold bg-background-secondary-color text-primary rounded-full px-2 text-[12px]">
            {service.category}
          </h2>

          {/* Displays the service name */}
          <h2 className="font-medium text-primary text-lg">
            {service.name}
          </h2>

          {/* Displays the service time with an icon */}
          <h2 className="text-light-blue-color flex items-center gap-1">
            <Clock className="w-4 h-4" /> {/* Clock icon to indicate time */}
            {service.time} Hours
          </h2>

          {/* Displays the service description or title */}
          <h2 className="text-gray-500 mb-3 text-sm">
            {service.title}
          </h2>

          {/* Button for booking the service */}
          <Button className='text-white'>
            Book Now
          </Button>
        </span>
      </Link>
    </div>
  );
};

export default Service;