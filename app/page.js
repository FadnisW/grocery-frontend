import Banner from "./_components/Banner";
import Category from "./_components/catergory/Category";
import Footer from "./_components/footer/Footer";
import Header from "./_components/Header";
import NewsLetter from "./_components/newsletter/NewsLetter";
import PaymentMethod from "./_components/PaymentMethod/PaymentMethod";
import Testimonial from "./_components/testimonial/Testimonial";
import Product from "./product/page";

export default async function Home() {
  return (
    <>
      <div className="p-10">
        <Banner /*getBanner={getBanner}*/ />
      </div>
      <div className="container mx-auto px-0">
        <PaymentMethod />
      </div>
      <Category />
      <div className="container mx-auto px-0 p-10">
        <h1 className="text-3xl font-semibold py-5">Popular Products</h1>
        <Product />
      </div>
      <Testimonial />
      <NewsLetter />
    </>
  );
}
