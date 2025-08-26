'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GlobalApi from '@/app/utils/GlobalApi';
import { ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProductInfo from '@/app/_components/ProductInfo';

// Search component that uses useSearchParams
const SearchComponent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://127.0.0.1:1337';

  useEffect(() => {
    if (searchQuery) {
      fetchProductsBySearch();
    }
  }, [searchQuery]);

  const fetchProductsBySearch = async () => {
    setLoading(true);
    try {
      // Using the products API to search by title
      const response = await GlobalApi.getProduct();
      if (response && response.data && response.data.data) {
        // Filter products by search query
        const filteredProducts = response.data.data.filter(product => 
          product.attributes.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='p-4 text-white bg-green-600 font-bold text-3xl text-center'>
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
      </h2>
      
      {loading ? (
        <div className="flex py-14 justify-center">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-green-500"></div>
            <img
              src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
              className="rounded-full h-24 w-24"
              alt="loading"
            />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-10">
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  <a href="#">
                    <img
                      className="rounded-t-lg p-8 hover:scale-125 hover:transition-transform cursor-pointer object-contain w-full h-48"
                      src={`${BASE_URL}${product?.attributes?.img?.data?.attributes?.url}`}
                      alt="Product Image"
                    />
                  </a>
                  <div className="px-5 pb-5">
                    <a href="#">
                      <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                        {product?.attributes?.title}
                      </h3>
                    </a>
                    <div className="flex items-center mt-2.5 mb-5">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product?.attributes?.rating || 0) ? 'text-yellow-300' : 'text-gray-300'}`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                        {product?.attributes?.rating || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${product?.attributes?.price}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <a
                            href="#"
                            className="flex items-center gap-3 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-large rounded-lg text-sm px-3 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          >
                            <ShoppingBag size={24} className="ps-2" />
                            Add To Cart
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
          ) : (
            <div className="text-center py-10">
              <h3 className="text-2xl font-semibold">No products found matching "{searchQuery}"</h3>
              <p className="mt-4">Try searching for a different term or browse our categories.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Main category page component
const CategoryPage = () => {
  return (
    <Suspense fallback={<div className="flex py-14 justify-center">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-green-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          className="rounded-full h-24 w-24"
          alt="loading"
        />
      </div>
    </div>}>
      <SearchComponent />
    </Suspense>
  );
};

export default CategoryPage;