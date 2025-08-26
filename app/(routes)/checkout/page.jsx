"use client";
import React, { useEffect, useState, useContext } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import GlobalApi, { basURL } from "@/app/utils/GlobalApi";
import { UpdateCartContext } from "@/app/_Context/_UpdateCartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Checkout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateCart, setUpdateCart } = useContext(UpdateCartContext);
  
  // Form state
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    // Check if JWT token exists in session storage
    const storedJwt = sessionStorage.getItem('jwt');
    const storedUser = sessionStorage.getItem('User');
    
    if (!storedJwt) {
      // If no JWT token, redirect to sign-in page
      router.push('/sign-in');
    } else {
      setJwt(storedJwt);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
      fetchCartItems(storedJwt);
    }
  }, [router]);
  
  // Listen for cart updates from the navbar
  useEffect(() => {
    if (jwt && user) {
      fetchCartItems(jwt);
    }
  }, [updateCart, jwt, user]);

  const fetchCartItems = async (token) => {
    try {
      const storedUser = sessionStorage.getItem('User');
      if (!storedUser) return;
      
      const parsedUser = JSON.parse(storedUser);
      const items = await GlobalApi.GetCartItems(parsedUser.id, token);
      setCartItems(items || []);
      
      // Calculate subtotal
      let total = 0;
      items?.forEach(item => {
        total += item.amount;
      });
      setSubtotal(total);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      toast.error("Failed to load cart items");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'address', 'zipCode'];
    const missingFields = requiredFields.filter(field => !billingDetails[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    const payload={
        data:{
            // paymentId:(data?.paymentId).toString(),
            paymentId: `MANUAL-${Date.now()}`, // Generate a unique ID for manual checkout
            userId:user.id,
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipcode: billingDetails.zipCode,
            TotalOrderedAmount: totalAmount,
            orderItemList: cartItems.map(item => ({
              Quantity: item.quantity.toString(),
              price: item.amount,
              product: item.product
            }))
        }
      }
    
    // Simulate payment processing
    setTimeout(() => {;
      // In a real app, you would process payment and create order here
      GlobalApi.placeOrder(payload,jwt).then((res)=>{
        console.log("Order Response: ",res)
        if(res){
          toast.success("Order placed successfully!");
          // Clear the cart after successful order
          clearCart();
          setIsProcessing(false);
          router.push('/');
        }
      });
    }, 2000);
  };



  // Function to clear all items from cart
  const clearCart = async () => {
    try {
      if (!cartItems || cartItems.length === 0) return;
      
      // Delete each cart item one by one
      const deletePromises = cartItems.map(item => 
        GlobalApi.deleteCartItems(item.id, jwt)
      );
      
      await Promise.all(deletePromises);
      console.log("All cart items cleared successfully");
      setCartItems([]);
      setSubtotal(0);
      setUpdateCart(!updateCart);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Calculate order summary
  const deliveryFee = 50; // Fixed delivery fee
  const taxRate = 0.05; // 5% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + deliveryFee + taxAmount;

  // Show loading state or checkout content based on authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Function to handle individual item deletion
  const onDeleteItem = async (id) => {
    try {
      const resp = await GlobalApi.deleteCartItems(id, jwt);
      if (resp) {
        toast.success("Cart item deleted successfully");
        // Update local cart state
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
        
        // Recalculate subtotal
        let total = 0;
        updatedCartItems.forEach(item => {
          total += item.amount;
        });
        setSubtotal(total);
        
        // Update global cart state for navbar
        setUpdateCart(!updateCart);
      } else {
        toast.error("Failed to delete cart item");
      }
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      toast.error("Failed to delete cart item");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Billing Details and Cart Items */}
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Billing Details Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Billing Details</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={billingDetails.name} 
                    onChange={handleInputChange} 
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={billingDetails.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={billingDetails.phone} 
                    onChange={handleInputChange} 
                    placeholder="+91 1234567890"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <Input 
                    id="zipCode" 
                    name="zipCode" 
                    value={billingDetails.zipCode} 
                    onChange={handleInputChange} 
                    placeholder="110001"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={billingDetails.address} 
                    onChange={handleInputChange} 
                    placeholder="123 Main St, Apartment 4B"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={billingDetails.city} 
                    onChange={handleInputChange} 
                    placeholder="New Delhi"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={billingDetails.state} 
                    onChange={handleInputChange} 
                    placeholder="Delhi"
                  />
                </div>
              </div>
            </form>
          </div>
          
          {/* Cart Items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Cart Items</h2>
            
            {cartItems.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                      {item.image ? (
                        <Image 
                          src={item.image.startsWith('http') ? item.image : `${basURL}${item.image}`} 
                          alt={item.name} 
                          width={80} 
                          height={80} 
                          className="h-full w-full object-contain object-center p-1"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">No image</div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${item.amount}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">${item.actualPrice} each</p>
                      </div>
                    </div>
                    <div className="ml-2">
                      <TrashIcon
                        className="h-5 w-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => onDeleteItem(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Your cart is empty</p>
                <Button 
                  onClick={() => router.push('/')} 
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <PayPalButtons 
              style={{ layout: "horizontal" }} 
              disabled={cartItems.length === 0}
              forceReRender={[totalAmount]}
              createOrder={(data, actions) => {
                // Validate form first
                const requiredFields = ['name', 'email', 'phone', 'address', 'zipCode'];
                const missingFields = requiredFields.filter(field => !billingDetails[field]);
                
                if (missingFields.length > 0) {
                  toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
                  return Promise.reject(new Error('Please fill in all required fields'));
                }
                
                // Ensure amount is valid for PayPal (minimum 0.01)
                const amount = Math.max(totalAmount, 0.01).toFixed(2);
                console.log('Creating PayPal order with amount:', amount, 'currency: USD');
                
                // Log form data for debugging
                console.log('Form data being submitted:', {
                  name: billingDetails.name,
                  email: billingDetails.email,
                  phone: billingDetails.phone,
                  address: billingDetails.address,
                  zipCode: billingDetails.zipCode
                });
                
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: amount,
                      currency_code: 'USD'
                    },
                    description: 'Grocery Store Purchase'
                  }]
                });
              }}
              onApprove={(data, actions) => {
                console.log('Payment approved, capturing order...');
                return actions.order.capture().then((details) => {
                  console.log('Payment captured successfully:', details);
                  setIsProcessing(true);
                  
                  // Create order payload
                  const orderPayload = {
                    data: {
                      paymentId: details.id,
                      userId: user.id,
                      name: billingDetails.name,
                      email: billingDetails.email,
                      phone: billingDetails.phone,
                      address: billingDetails.address,
                      city: billingDetails.city,
                      state: billingDetails.state,
                      zipcode: billingDetails.zipCode,
                      TotalOrderedAmount: totalAmount,
                      orderItemList: cartItems.map(item => ({
                        Quantity: item.quantity.toString(),
                        price: item.amount,
                        product: item.product
                      }))
                    }
                  };
                  
                  // Save order to Strapi
                  GlobalApi.placeOrder(orderPayload, jwt).then((res) => {
                    console.log("Order Response: ", res);
                    if (res) {
                      toast.success("Payment successful! Order placed.");
                      // Clear the cart after successful order
                      clearCart();
                      setTimeout(() => {
                        setIsProcessing(false);
                        router.push('/');
                      }, 2000);
                    } else {
                      toast.error("Payment successful but failed to save order. Please contact support.");
                      setIsProcessing(false);
                    }
                  }).catch(error => {
                    console.error("Failed to save order:", error);
                    toast.error("Payment successful but failed to save order. Please contact support.");
                    setIsProcessing(false);
                  });
                }).catch(err => {
                  console.error('Error capturing payment:', err);
                  toast.error(`Error capturing payment: ${err.message || 'Please try again'}`);
                  setIsProcessing(false);
                });
              }}
              onError={(err) => {
                console.error('PayPal Error details:', err);
                // Extract more detailed error information if available
                let errorMessage = 'Please try again';
                if (err) {
                  if (err.message) {
                    errorMessage = err.message;
                  } else if (err.details && err.details.length > 0) {
                    errorMessage = err.details[0].issue || err.details[0].description;
                  }
                }
                toast.error(`Payment failed: ${errorMessage}`);
              }}
              onCancel={() => {
                toast.info("Payment cancelled. You can try again when ready.");
              }}
            />
            
            {/* Test Payment Button - Commented out as it was only for testing purposes
            <div className="mt-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium rounded-md"
                onClick={handleSubmit}
                disabled={isProcessing || cartItems.length === 0}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Test Payment (No PayPal)"
                )}
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">
                This is a test button to verify order processing without using PayPal
              </p>
            </div>
            */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>We accept all major credit cards and Debit cards payments</p>
              <div className="flex justify-center space-x-2 mt-2">
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

