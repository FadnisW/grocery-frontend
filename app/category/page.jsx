'use client';
import React, { useEffect, useState } from 'react';
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

const CategoryPage = () => {
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
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
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

export default CategoryPage;