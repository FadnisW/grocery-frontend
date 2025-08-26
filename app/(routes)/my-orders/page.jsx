"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import moment from "moment";
import GlobalApi, { basURL } from "@/app/utils/GlobalApi";

export default function MyOrders() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('User') : null;
    const storedJwt = typeof window !== 'undefined' ? sessionStorage.getItem('jwt') : null;

    if (!storedUser || !storedJwt) {
      toast.error("Please login to view your orders");
      router.push('/sign-in');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setJwt(storedJwt);
      
      // Fetch orders
      fetchOrders(parsedUser.id, storedJwt);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Error loading order data");
      setLoading(false);
    }
  }, [router]);

  const fetchOrders = async (userId, token) => {
    try {
      const orderList = await GlobalApi.MyOrderList(userId, token);
      if (orderList && orderList.length > 0) {
        setOrders(orderList);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      case 'out for delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
      
      <div className="max-w-6xl mx-auto">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Your order history</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Order Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {moment(order.createdAt).format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell>{order.paymentId}</TableCell>
                      <TableCell>
                        ${order.amount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                          {order.Status || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleOrderExpand(order.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedOrder === order.id ? (
                            <>
                              <span>Hide Details</span>
                              <ChevronUpIcon className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <span>View Details</span>
                              <ChevronDownIcon className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Collapsible Order Details */}
                    {expandedOrder === order.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
                          <div className="bg-gray-50 p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">Image</TableHead>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.orderItemList && order.orderItemList.map((item, index) => {
                                  const product = item.product?.data?.attributes;
                                  const image = product?.img?.data?.attributes?.url;
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {image ? (
                                          <div className="h-16 w-16 relative rounded overflow-hidden">
                                            <Image 
                                              src={image && typeof image === 'string' && image.startsWith('http') ? image : `${basURL}${image}`}
                                              alt={product?.title || 'Product'}
                                              fill
                                              className="object-contain"
                                            />
                                          </div>
                                        ) : (
                                          <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                                            <span className="text-xs text-gray-500">No image</span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <div>
                                          <p className="font-medium">{product?.title || 'Product'}</p>
                                          <p className="text-sm text-gray-500">${product?.price?.toFixed(2) || '0.00'} each</p>
                                        </div>
                                      </TableCell>
                                      <TableCell>{item.Quantity}</TableCell>
                                      <TableCell>${item.price?.toFixed(2) || '0.00'}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Shipping Details</h4>
                                <div className="text-sm">
                                  <p><span className="font-medium">Name:</span> {order.name}</p>
                                  <p><span className="font-medium">Email:</span> {order.email}</p>
                                  <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                  <p><span className="font-medium">Address:</span> {order.address}</p>
                                  <p><span className="font-medium">City:</span> {order.city}</p>
                                  <p><span className="font-medium">State:</span> {order.state}</p>
                                  <p><span className="font-medium">Zip:</span> {order.zipcode || 'N/A'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                                <div className="text-sm">
                                  <p><span className="font-medium">Payment ID:</span> {order.paymentId}</p>
                                  <p><span className="font-medium">Order Date:</span> {moment(order.createdAt).format('MMMM DD, YYYY, h:mm A')}</p>
                                  <p><span className="font-medium">Total Amount:</span> ${order.amount?.toFixed(2) || '0.00'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>You haven't placed any orders yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Browse our products and place your first order!</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push('/')}
              >
                Shop Now
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}