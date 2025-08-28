import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@headlessui/react";
import Image from "next/image";

const Banner = (/*{ getBanner }*/) => {
  //   const BASE_URL = "http://127.0.0.1:1337";
  //   console.log("Banner:", JSON.stringify(Banner, null, 2));
  //   console.log("Banner API Response:", getBanner);
  return (
    <>
      <div className="container mx-auto px-0">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div className="Banner2 p-5 object-cover rounded-2xl">
                <div className="relative h-[200px] md:h-[400px] w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/Banner101.png"
                    alt="Banner1"
                    fill
                    className="w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="Banner2 p-5 object-cover rounded-2xl">
                <div className="relative h-[200px] md:h-[400px] w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/Banner102.png"
                    alt="Banner1"
                    fill
                    className="w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="Banner2 p-5 object-cover rounded-2xl">
                <div className="relative h-[200px] md:h-[400px] w-full rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/Banner103.png"
                    alt="Banner1"
                    fill
                    className="w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default Banner;

// {getBanner.map((banners, index) => (
//               <CarouselItem key={index}>
//                 <div className="Banner1 p-5 object-cover rounded-2xl">
//                   <div className="grid grid-cols-2 items-center">
//                     <Image
//                       src={`/${BASE_URL}${banners?.attributes?.Banner?.data?.attributes?.url}`} //Needs to be fixed
//                       alt="Banner"
//                       width={1000}
//                       height={400}
//                       className="w-full"
//                     />
//                   </div>
//                 </div>
//               </CarouselItem>
//             ))}
