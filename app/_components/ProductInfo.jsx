"use client";
import { Button } from "@headlessui/react";
import { toast } from "sonner";
import { LoaderCircleIcon, Router, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, use } from "react";
import GlobalApi from "../utils/GlobalApi";
import { UpdateCartContext } from "../_Context/_UpdateCartContext";
import { useContext } from "react";

const ProductInfo = ({ product }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const jwt = sessionStorage.getItem('jwt');
  useEffect(() => {
    const fetchUserData = async () => {
      if (!jwt) {
        console.warn("No JWT token found in sessionStorage");
        return;
      }
      
      try {
        // First try to get user from sessionStorage
        const storedUser = sessionStorage.getItem('User');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Using user from sessionStorage:", parsedUser);
          setUser(parsedUser);
          return;
        }
        
        // If not in sessionStorage, fetch from API
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Fetched user from Strapi:", data);
        setUser(data);
        
        // Store in sessionStorage for future use
        sessionStorage.setItem('User', JSON.stringify(data));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast.error("Failed to load user information");
      }
    };
    
    fetchUserData();
  }, [jwt]);

  console.log("JWT:", jwt);
  console.log("User:", user);
  const {updateCart, setUpdateCart} = useContext(UpdateCartContext);
  const [ProductTotalPrice, setProductTotalPrice] = useState(
    product?.attributes?.disprice
      ? product?.attributes?.disprice
      : product?.attributes?.price
  );

  const [quantity, setQuantity] = useState(1);

  const AddtoCart = () => {
    setLoading(true);
    if (!jwt) {
      toast("Please Sign In to add products to cart");
      router.push("/sign-in");
      setLoading(false);
      return;
    }
    if (!user) {
      toast("User information not loaded yet. Please try again.");
      setLoading(false);
      return;
    }
    const data = {
      data: {
        Quantity: quantity,
        Amount: (quantity * ProductTotalPrice).toFixed(2),
        products: product.id,
        users_permissions_users: user.id,
        userId: user.id,
      },
    };
    console.log("Add to Cart Data:", data);
    GlobalApi.AddtoCart(data, jwt).then(
      (resp) => {
        console.log("Add to Cart Response:", resp);
        toast("Product added to cart successfully");
        setUpdateCart(!updateCart);
        setLoading(false);
      },
      (e) => {
        console.error("Error adding to cart:", e);
        toast.error("Failed to add product to cart");
        setLoading(false);
      }
    );
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black">
        <img
          src={`${BASE_URL}${product?.attributes?.img?.data?.attributes?.url}`}
          alt="Image"
          width={300}
          height={300}
          className="bg-slate-200 p-5 h-[320px] w-[300px] object-contain rounded-lg"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text 2xl font-bold">{product?.attributes?.title}</h2>
          <h2 className="text-sm text-gray-500">
            {product?.attributes?.description}
          </h2>
          <div>
            <div className="flex gap-3 justify-start">
              <span
                className={`text-2xl font-semibold text-gray-500 dark:text-white ${
                  product?.attributes?.disprice && "line-through text-black-100"
                }`}
              >
                ${product?.attributes?.price}
              </span>
              {product?.attributes?.disprice && (
                <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                  ${product?.attributes?.disprice}
                </span>
              )}
            </div>
          </div>
          <h2 className="font-medium text-lg">
            Quantity:({product?.attributes?.Quantity})
          </h2>
          <div className="flex flex-col items-baseline gap-3 ">
            <div className="flex gap-3 items-center">
              <div className="p-2 border flex gap-10 items-center px-3">
                <button
                  disabled={quantity == 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  -
                </button>
                <h2>{quantity}</h2>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <h2 className="text-2xl font-bold">
                = ${(quantity * ProductTotalPrice).toFixed(2)}
              </h2>
            </div>
            <Button className="flex items-center gap-3 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-large rounded-lg text-sm px-3 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            disabled={loading}
            onClick={() => AddtoCart()}>
              <ShoppingBag
                size={24}
                className="ps-2"
              />
              {loading ? <LoaderCircleIcon className="animate-spin" /> : "Add To Cart"}
            </Button>
          </div>
          <h2 className="font-bold">
            <span>Category: </span>
            {product?.attributes?.categories?.data[0]?.attributes?.title}
          </h2>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
