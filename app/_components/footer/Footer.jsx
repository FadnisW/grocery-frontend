import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="bg-white">
        <div className="container px-4 mx-auto">
          <div className="pt-24 pb-11 mx-auto max-w-4xl">
            <a className="block md:mx-auto mb-5 max-w-max" href="#">
              <Image 
                src="/assets/mainlogo.png" 
                width={120} 
                height={60} 
                alt="Grocery Store Logo" 
              />
            </a>
            <div className="flex flex-wrap justify-center -mx-3 lg:-mx-6">
              <div className="w-full md:w-auto p-3 md:px-6">
                <a
                  href="/terms"
                  className="inline-block text-lg text-gray-500 hover:text-gray-600 font-medium"
                >
                  Terms
                </a>
              </div>
              <div className="w-full md:w-auto p-3 md:px-6">
                <a
                  href="/privacy"
                  className="inline-block text-lg text-gray-500 hover:text-gray-600 font-medium"
                >
                  Privacy
                </a>
              </div>
              <div className="w-full md:w-auto p-3 md:px-6">
                <a
                  className="inline-block text-lg text-gray-500 hover:text-gray-600 font-medium"
                  href=""
                >
                  Contact Us
                </a>
              </div>
              <div className="w-full md:w-auto p-3 md:px-6">
                <a
                  href="/careers"
                  className="inline-block text-lg text-gray-500 hover:text-gray-600 font-medium"
                >
                  Careers
                </a>
              </div>
              <div className="w-full md:w-auto p-3 md:px-6">
                <a
                  href="/pricing"
                  className="inline-block text-lg text-gray-500 hover:text-gray-600 font-medium"
                >
                  Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-100"></div>
        <div className="container px-4 mx-auto">
          <p className="py-10 md:pb-20 text-md text-gray-400 font-medium text-center">
            © 2024 Grocery Store \ Waqar Fadnis All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
