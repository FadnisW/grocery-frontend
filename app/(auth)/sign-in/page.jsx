"use client";
import Image from "next/image";
import Link from "next/link";
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
const SignIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loader, setLoader] = useState();
  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      router.push("/");
    }
  }, []);
  const router = useRouter();
  const onSignIn = () => {
    setLoader(true)
    GlobalApi.SignIn(email, password).then(
      (resp) => {
        console.log(resp.data.user);
        console.log(resp.data.jwt);
        sessionStorage.setItem('User', JSON.stringify(resp.data.user));
        sessionStorage.setItem('jwt', resp.data.jwt);
        router.push("/");
        setLoader(false)
        toast("Login Successfull!");
      },
      (e) => {
        console.log(e);
        setLoader(false)
        toast(e?.response?.data?.error?.message);
      }
    );
  };
  return (
    <>
      <div className="flex- item-baseline justify-cennter my-5">
        <div className="flex flex-col items-center justify-center p-10 bg-slate-100 border border-gray-200">
          <Image
            src={"/assets/mainlogo.png"}
            width={200}
            height={200}
            alt="Logo"
          />
          <h2 className="font-bold text 3xl">Sign-In to your account</h2>
          <h2 className="text-gray-500 pt-10">
            Enter your Email and Password to Sign-In
          </h2>
          <div className="flex flex-col gap-5 mt-7">
            <Input
              placeholder="Email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-large rounded-lg text-sm px-3 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={(e) => onSignIn(e)}
              disabled={!(email || password)}
            >
              {loader?<LoaderIcon className="animate-spin"/>:'Sign-In'}
            </Button>
            <p>
              Don't have an account?{" "}
              <Link className="text-blue-500" href={"/create-account"}>
                Click Here to Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
