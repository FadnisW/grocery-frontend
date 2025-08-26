import axios from "axios";

// Use environment variables for API URLs
export const basURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL.replace('/api', '')
  : "http://127.0.0.1:1337";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://127.0.0.1:1337/api",
});
//GetBanner Fetch from Strapi
const getBanner = () =>
  axiosClient
    .get("/banners?populate=*")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.error("Error fetching banners:", error);
      return []; // Return an empty array or handle the error as needed
    });
//GetCategory Fetch from Strapi
const getCategory = () => axiosClient.get("/categories?populate=*");
//GetProducts Fetch from Strapi
const getProduct = () => axiosClient.get("/products?populate=*");
//Get Products by Category
const getSingleCategory = async (category) => {
  try {
    // Decode the category name before using it in the API query
    // This is necessary because the category name is already URL-encoded when passed to this function
    const decodedCategory = decodeURIComponent(category);
    // Encode the category name for the API query to handle special characters like &
    const encodedCategory = encodeURIComponent(decodedCategory);
    const response = await axiosClient.get(
      `products?populate=*&filters[categories][title][$in]=${encodedCategory}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching single category:", error);
    return null; // or a fallback value
  }
};

const registerUser = (username, email, password) =>
  axiosClient.post("/auth/local/register", {
    username: username,
    email: email,
    password: password,
  });
const SignIn = (email, password) =>
  axiosClient.post("/auth/local", {
    identifier: email,
    password: password,
  });
const AddtoCart = (data, jwt) =>
  axiosClient.post("/user-carts", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
const GetCartItems = async (userId, jwt) => {
  try {
    const resp = await axiosClient.get(
      "/user-carts?filters[userId][$eq]=" +
        userId +
        "&[populate][products][populate][img][populate][0]=url",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log("GlobalApi - Raw response data:", resp.data);
    const data = resp.data?.data;

    if (!Array.isArray(data)) {
      console.warn("GlobalApi - Cart response is not an array:", resp.data);
      return [];
    }

    const cartItemList = data.map((item) => {
      const product = item.attributes.products?.data?.[0];
      const img = product?.attributes?.img?.data;
      console.log("GlobalApi - Product:", product);
      console.log("GlobalApi - IMG:", img);
      console.log("GlobalApi - Item:", item);
      return {
        name: product?.attributes?.title || "Unknown",
        quantity: item.attributes.Quantity,
        amount: item.attributes.Amount,
        image: img?.attributes?.url ? img.attributes.url : null,
        actualPrice: product?.attributes?.price || 0,
        id: item.id,
        product: item.attributes.products?.data?.[0].id,
      };
    });

    console.log("GlobalApi - Processed cartItemList:", cartItemList);
    return cartItemList;
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return [];
  }
};

const deleteCartItems = async (id, jwt) => {
  try {
    const resp = await axiosClient.delete("/user-carts/" + id, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("GlobalApi - Raw response data:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Failed to delete cart item:", error);
    return null;
  }
};

const placeOrder = async (data, jwt) => {
  try {
    const resp = await axiosClient.post("/orders", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("GlobalApi - Raw response data:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Failed to place order:", error);
    return null;
  }
};

const MyOrderList = async (userId, jwt) => {
  try {
    const resp = await axiosClient.get(
      "/orders?filters[userId][$eq]=" +
        userId +
        "&populate[orderItemList][populate][product][populate]=*",

      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("GlobalApi - Raw response data:", resp.data);
    const response = resp.data?.data;
    console.log("GlobalApi - Processed order list with IMG:", response);
    const OrderList = response.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      email: item.attributes.email,
      phone: item.attributes.phone,
      orderId: item.attributes.orderId,
      city: item.attributes.city,
      state: item.attributes.state,
      zipcode: item.attributes.zipcode,
      userId: item.attributes.userId,
      address: item.attributes.address,
      paymentId: item.attributes.paymentId,
      amount: item.attributes.TotalOrderedAmount || item.attributes.amount,
      orderItemList: item.attributes.orderItemList,
      createdAt: item.attributes.createdAt,
      Status: item.attributes.Status,
    }));
    return OrderList;
  } catch (error) {
    console.error("Failed to fetch order list:", error);
    return null;
  }
};

export default {
  getCategory,
  getProduct,
  getSingleCategory,
  registerUser,
  SignIn,
  AddtoCart,
  GetCartItems,
  deleteCartItems,
  placeOrder,
  MyOrderList,
};

// getBanner
