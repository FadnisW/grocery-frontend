"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Button,
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { BadgeAlert, ShoppingBagIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlobalApi from "../utils/GlobalApi";
import { toast } from "sonner";
import { UpdateCartContext } from "../_Context/_UpdateCartContext";
import { useContext } from "react";
import CartItemList from "./CartItemList";
const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [TotalCartItem, setTotalCartItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const {updateCart, setUpdateCart} = useContext(UpdateCartContext);
  const [cartItemList, setCartItemList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("User");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [jwt, setJwt] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("jwt");
    }
    return null;
  });

  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("jwt");
    }
    return false;
  });

  const router = useRouter();

  useEffect(() => {
    if (user && jwt) {
      GetCartItems();
    }
  }, [user, jwt, updateCart]);

  const onSignOut = () => {
    sessionStorage.clear();
    setIsLogin(false);
    setUser(null);
    setJwt(null);
    router.push("/sign-in");
  };

  const onDeleteItem = async (id) => {
    try {
      const resp = await GlobalApi.deleteCartItems(id, jwt);
      if (resp) {
        toast.success("Cart item deleted successfully");
        setUpdateCart(!updateCart);
      } else {
        toast.error("Failed to delete cart item");
      }
    } catch (error) {
      console.error("Failed to delete cart item:", error);
      toast.error("Failed to delete cart item");
    }
  };

  useEffect(() => {
    let total = 0;
    cartItemList.forEach(element => {
      total = total + element.amount;
    });
    setSubtotal(total);
  }, [cartItemList]);


  const GetCartItems = async () => {
  const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('User') : null;
  const storedJwt = typeof window !== 'undefined' ? sessionStorage.getItem('jwt') : null;

  console.log("GetCartItems - storedUser:", storedUser);
  console.log("GetCartItems - storedJwt:", storedJwt);

  if (!storedUser || !storedJwt) {
    console.warn("Missing user or JWT. Please login first.");
    return;
  }

  const parsedUser = JSON.parse(storedUser);

  try {
    const _cartItemList = await GlobalApi.GetCartItems(parsedUser.id, storedJwt);
    setTotalCartItems(_cartItemList?.length || 0);
    setCartItemList(_cartItemList || []);
    console.log("Header - Cart Items fetched:", _cartItemList);
  } catch (error) {
    console.error("Header - Failed to fetch cart items:", error);
  }
};

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="container mx-auto flex items-center justify-between py-6 px-0"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              src="/assets/mainlogo.png"
              width={120}
              height={60}
              alt="Main Logo"
            />
          </a>
        </div>
        {/* Mobile menu button restored but navigation links remain hidden */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden">
          {/* Navigation links hidden as requested */}
          <a href="#" className="text-md font-semibold leading-6 text-gray-900">
            Shop
          </a>
          <a href="#" className="text-md font-semibold leading-6 text-gray-900">
            About
          </a>
          <a href="#" className="text-md font-semibold leading-6 text-gray-900">
            Contact us
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-2 w-40"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
                      setShowSearch(false);
                      setSearchQuery("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon width={20} />
                </button>
              </div>
            ) : (
              <a className="bg-green-200 p-2 rounded-full h-9 w-9 flex items-center justify-center" onClick={() => setShowSearch(true)}>
                <Search
                  size={20}
                  className="cursor-pointer hover:scale-110 hover:transition-transform"
                />
              </a>
            )}
          </div>
          {isLogin && (
            <a className="bg-green-200 p-2 rounded-full h-9 w-9">
              <Sheet>
                <SheetTrigger>
                  <ShoppingBagIcon
                    width={20}
                    className="cursor-pointer hover:scale-110 hover:transition-transform"
                  />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-white bg-green-600">
                      My Cart
                    </SheetTitle>
                    <SheetDescription>
                      <CartItemList
                        cartItemList={cartItemList}
                        onDeleteItem={onDeleteItem}
                      />
                    </SheetDescription>
                  </SheetHeader>
                  <SheetClose>
                    <div className="absolute w-[90%] bottom-6 flex flex-col">
                      <h2 className="text-lg font-bold flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal}</span>
                      </h2>
                      <Button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(jwt?'/checkout':'/sign-in')}>
                        Checkout
                      </Button>
                    </div>
                  </SheetClose>
                </SheetContent>
              </Sheet>
            </a>
          )}
          {isLogin && (
            <Badge className="text-xs text-center w-7 h-7">
              <span className="bg-primary text-white">{TotalCartItem}</span>
            </Badge>
          )}
          {isLogin && (
            <a className="bg-green-200 p-2 rounded-full h-9 w-9">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserCircleIcon
                    width={20}
                    className="cursor-pointer hover:scale-110 hover:transition-transform"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/my-orders')}>My Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSignOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </a>
          )}
          {!isLogin && (
            <Link href={"/sign-in"}>
              <Button className="rounded bg-green-600 py-2 px-4 text-sm text-white data-[hover]:bg-green-700 data-[active]:bg-green-600">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* Mobile navigation links hidden as requested */}
              <div className="hidden space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6 flex gap-5">
                <div className="relative">
                  {showSearch ? (
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mr-2 w-40"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchQuery.trim()) {
                            router.push(`/category?search=${encodeURIComponent(searchQuery)}`);
                            setShowSearch(false);
                            setSearchQuery("");
                            setMobileMenuOpen(false);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon width={20} />
                      </button>
                    </div>
                  ) : (
                    <a className="bg-green-200 p-2 rounded-full h-9 w-9 flex items-center justify-center" onClick={() => setShowSearch(true)}>
                      <Search
                        size={20}
                        className="cursor-pointer hover:scale-110 hover:transition-transform"
                      />
                    </a>
                  )}
                </div>
                {isLogin && (
                  <a className="bg-green-200 p-2 rounded-full h-9 w-9">
                    <Sheet>
                      <SheetTrigger>
                        <ShoppingCartIcon
                          width={22}
                          className="cursor-pointer hover:scale-110 hover:transition-transform"
                        />
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle className="text-white bg-green-600">
                            My Cart
                          </SheetTitle>
                          <SheetDescription>
                            <CartItemList
                              cartItemList={cartItemList}
                              onDeleteItem={onDeleteItem}
                            />
                          </SheetDescription>
                        </SheetHeader>
                        <SheetClose>
                          <div className="absolute w-[90%] bottom-6 flex flex-col">
                            <h2 className="text-lg font-bold flex justify-between">
                              <span>Subtotal:</span>
                              <span>${subtotal}</span>
                            </h2>
                            <Button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(jwt?'/checkout':'/sign-in')}>
                              Checkout
                            </Button>
                          </div>
                        </SheetClose>
                      </SheetContent>
                    </Sheet>
                  </a>
                )}
                {isLogin && (
                  <a className="bg-green-200 p-2 rounded-full h-9 w-9">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <UserCircleIcon
                          width={20}
                          className="cursor-pointer hover:scale-110 hover:transition-transform"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/my-orders')}>My Orders</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSignOut()}>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </a>
                )}
                {!isLogin && (
                  <Link href={"/sign-in"}>
                    <Button className="rounded bg-green-600 py-2 px-4 text-sm text-white data-[hover]:bg-green-700 data-[active]:bg-green-600">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

{
  /* <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              Product
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                  >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none text-gray-400"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover> */
}
