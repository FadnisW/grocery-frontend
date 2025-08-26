"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import Link from "next/link";
// import Image from "next/image";
import React, { useEffect, useState } from "react";

const Category = () => {
  // const BASE_URL = "http://localhost:1337";
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [CategoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const response = await GlobalApi.getCategory();
       console.log("API Response:", response.data.data);
      if (response && response.data) {
        setCategoryList(response.data);
      } else {
       console.log("No data found in API response.");
      }
    } catch (error) {
      console.log("An Error occured in getCategoryList: " + error);
    }
  };
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
        <h1 className="text-3xl font-semibold py-5">Explore Categories</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 text-center items-center gap-2 sm:gap-6 md:gap-8 lg:gap-10 justify-center mx-auto">
          {CategoryList?.data?.length > 0 ? (
            CategoryList.data.map((category, index) => (
              <Link
                href={"/product-category/" + encodeURIComponent(category.attributes.title)}
                key={index}
                className="flex flex-col items-center bg-green-50 gap-2 rounded-lg pt-4 sm:pt-5 h-full mx-auto w-full max-w-[120px] sm:max-w-none"
              >
                <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[75px] md:h-[75px] flex items-center justify-center">
                  <img
                    src={`${BASE_URL}${category?.attributes?.img?.data?.attributes?.url}`}
                    className="hover:scale-110 rounded-lg hover:transition-transform cursor-pointer max-w-full max-h-full object-contain"
                    alt="Category"
                  />
                </div>
                <p className="pb-4 sm:pb-5 text-sm sm:text-base">{category?.attributes?.title}</p>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center py-14">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-purple-500"></div>
                <img
                  src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
                  className="rounded-full h-24 w-24"
                  alt="category"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
