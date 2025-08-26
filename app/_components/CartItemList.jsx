import { basURL } from "../utils/GlobalApi";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";
import "../globals.css";

function CartItemList({ cartItemList, onDeleteItem }) {
  console.log("CartItemList - cartItemList:", cartItemList);
  
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState({});
  

  return (
    <div>
      <div className="h-[80vh] overflow-y-auto">

        {cartItemList.map((cart, index) => {
          console.log("CartItemList - cart item:", cart);
          const imageUrl = cart.image && !cart.image.startsWith('http') ? `${basURL}${cart.image}` : cart.image;
          console.log("CartItemList - image URL:", imageUrl);
          return (
            <div 
              key={index} 
              className={`cart-item-container ${itemsBeingDeleted[cart.id] ? 'fade-out' : ''}`}>
              <div className="flex justify-between items-center p-2 mb-5">
                <div className="flex gap-6 items-center">
                  {imageUrl ? (
                    <Image src={imageUrl} width={70} height={70} alt={cart.name || 'Cart item'} 
                    className="border p-2"/>
                  ) : (
                    <div style={{ width: 70, height: 70, backgroundColor: '#f0f0f0' }}>No image</div>
                  )}
                  <div>
                    <h2 className="font-bold">{cart.name}</h2>
                    <h2>Quantity: {cart.quantity}</h2>
                    <h2 className="text-lg font-bold">${cart.amount}</h2>
                  </div>
                </div>
                <TrashIcon
                  className="cursor-pointer hover:scale-110 hover:transition-transform" 
                  onClick={() => {
                    // Set this item as being deleted
                    setItemsBeingDeleted(prev => ({ ...prev, [cart.id]: true }));
                    
                    // Wait for animation to complete before actual deletion
                    setTimeout(() => {
                      onDeleteItem(cart.id);
                    }, 500); // Match this with the CSS animation duration
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* <div className="absolute w-[90%] bottom-6 flex flex-col">
        <h2 className="text-lg font-bold flex justify-between"><span>Subtotal:</span><span>${subtotal}</span></h2>
        <Button className="bg-green-600 text-white px-4 py-2 rounded-md">
          Checkout
        </Button>
      </div> */}
    </div>
  );
}

export default CartItemList;
