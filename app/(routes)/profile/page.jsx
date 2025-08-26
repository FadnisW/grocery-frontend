"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaWhatsapp } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('User') : null;
    const storedJwt = typeof window !== 'undefined' ? sessionStorage.getItem('jwt') : null;

    if (!storedUser || !storedJwt) {
      toast.error("Please login to view your profile");
      router.push('/sign-in');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setJwt(storedJwt);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Error loading profile data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleWhatsAppContact = () => {
    // Replace with your admin's WhatsApp number
    const adminNumber = "1234567890";
    const message = encodeURIComponent("Hello, I would like to update my account information.");
    window.open(`https://wa.me/${adminNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
      <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-1">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/assets/avatar-placeholder.svg" alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.username}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-gray-500">User ID</h3>
                <p>{user?.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Account Created</h3>
                <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Account Type</h3>
                <p>{user?.provider || "Email"}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Confirmed</h3>
                <p>{user?.confirmed ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <p className="text-gray-500 mb-4">To update your shipping address, payment methods, or other account details, please contact our customer support team.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleWhatsAppContact}
            >
              <FaWhatsapp className="mr-2 h-5 w-5" />
              Contact Admin via WhatsApp
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => router.push('/checkout')}
            >
              Go to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}