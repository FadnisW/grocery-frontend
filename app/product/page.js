"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import React, { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductInfo from "../_components/ProductInfo";



const Product = () => {
  const BASE_URL = 'http://127.0.0.1:1337';
  const [ProductList, setProductList] = useState([]);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const response = await GlobalApi.getProduct();
      if (response && response.data) {
        //console.log(response);
        // console.log("Product API Response:", response.data);
        setProductList(response.data.data); // Corrected to access the product list
      } else {
        // console.log("No data found in API response.");
      }
    } catch (error) {
      // console.log("An Error occurred in getProductList: " + error);
    }
  };

  return (
    <>
      {ProductList?.length > 0 ? (
        <div className="container mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {ProductList.slice(0, 8).map((product, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full"
              >
                <a href="#">
                  <img
                    className="rounded-t-lg p-8 hover:scale-125 hover:transition-transform cursor-pointer object-contain w-full h-48"
                    src={`${BASE_URL}${product?.attributes?.img?.data?.attributes?.url}`}
                    alt="Product Image"
                  />
                </a>
                <div className="px-4 sm:px-5 pb-5 flex-grow flex flex-col">
                  <a href="#">
                    <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                      {product?.attributes?.title}
                    </h3>
                  </a>
                  <div className="flex items-center justify-between mt-2.5 mb-5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className="w-5 h-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                        {product?.attributes?.rating}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <HeartIcon
                        width={30}
                        className="hover:text-red-200 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-2 mt-auto">
                    <div className="flex gap-2 justify-start">
                      <span
                        className={`text-1xl font-semibold text-gray-900 dark:text-white ${
                          product?.attributes?.disprice &&
                          "line-through text-black-100"
                        }`}
                      >
                        ${product?.attributes?.price}
                      </span>
                      {product?.attributes?.disprice && (
                        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                          ${product?.attributes?.disprice}
                        </span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <a
                          href="#"
                          className="flex items-center justify-center gap-1 sm:gap-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full md:w-auto max-w-full overflow-hidden"
                        >
                          <ShoppingBag size={20} className="flex-shrink-0 sm:hidden xl:flex" />
                          <span className="whitespace-nowrap mx-auto">Add To Cart</span>
                        </a>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogDescription>
                          <ProductInfo product={product}/>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex py-14">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-purple-500"></div>
            <img
              src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
              className="rounded-full h-24 w-24"
              alt="loading"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
