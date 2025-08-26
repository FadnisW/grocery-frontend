import GlobalApi from '@/app/utils/GlobalApi';
import React from 'react';
import CategoryProductList from '../_components/CategoryProductList';
import Footer from '@/app/_components/footer/Footer';
import Header from '@/app/_components/Header';
import Category from '@/app/_components/catergory/Category';

const ProductCategory = async ({ params }) => {
  console.log("Category name in URL:", params.categoryName);
  const response = await GlobalApi.getSingleCategory(params.categoryName);
  const getCategory = await GlobalApi.getCategory();

  if (!response || !getCategory) {
    return <div>Error loading category or products.</div>;
  }

  const getProduct = response.data.data;
  console.log("SingProduct"+getProduct)

  // Decode the URL parameter to properly display category names with spaces and special characters
  const decodedCategoryName = decodeURIComponent(params.categoryName);
  
  return (
    <>
      <h2 className='p-4 text-white bg-green-600 font-bold text-3xl text-center'>{decodedCategoryName}</h2>
      <Category />
      <div className="container mx-auto px-0 p-10 ">
      <CategoryProductList categoryName={params.categoryName} />
      </div>
    </>
  );
};

export default ProductCategory;