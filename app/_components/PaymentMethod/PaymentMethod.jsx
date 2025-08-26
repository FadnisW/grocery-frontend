import { ReceiptRefundIcon } from "@heroicons/react/24/outline";
import { Headphones, Receipt, Rocket, ShieldCheckIcon } from "lucide-react";
import React from "react";

const PaymentMethod = () => {
  return (
    <>
      <div className="container py-16 px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 md:gap-8 lg:gap-10">
          <div className="grid grid-cols-3 bg-green-100 py-3 sm:py-4 rounded-xl mx-auto w-full max-w-xs sm:max-w-none">
            <div className="flex justify-center">
                <Rocket size={40} className="bg-green-500 text-white p-1.5 sm:p-2 rounded-lg"/>
            </div>
            <div className="col-span-2 pr-2">
                <h2 className="font-semibold text-sm sm:text-base">Free Shipping</h2>
                <p className="text-xs">free delivery on order above $100.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 bg-green-100 py-3 sm:py-4 rounded-xl mx-auto w-full max-w-xs sm:max-w-none">
            <div className="flex justify-center">
                <ReceiptRefundIcon width={40} height={40} className="bg-green-500 text-white p-1.5 sm:p-2 rounded-lg"/>
            </div>
            <div className="col-span-2 pr-2">
                <h2 className="font-semibold text-sm sm:text-base">Easy To Return</h2>
                <p className="text-xs">10 days money back guarantee.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 bg-green-100 py-3 sm:py-4 rounded-xl mx-auto w-full max-w-xs sm:max-w-none">
            <div className="flex justify-center">
                <ShieldCheckIcon size={40} className="bg-green-500 text-white p-1.5 sm:p-2 rounded-lg"/>
            </div>
            <div className="col-span-2 pr-2">
                <h2 className="font-semibold text-sm sm:text-base">Secure Payment</h2>
                <p className="text-xs">Use our safe payment method.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 bg-green-100 py-3 sm:py-4 rounded-xl mx-auto w-full max-w-xs sm:max-w-none">
            <div className="flex justify-center">
                <Headphones size={40} className="bg-green-500 text-white p-1.5 sm:p-2 rounded-lg"/>
            </div>
            <div className="col-span-2 pr-2">
                <h2 className="font-semibold text-sm sm:text-base">Dedicated Support</h2>
                <p className="text-xs">Full support from our side.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
