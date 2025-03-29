'use client';
// ------------ Hooks ----------------
import {  useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
// ------------ Icons ----------------
import { LogOut, User } from "lucide-react";
// ------------ Components ----------------
import Image from "next/image";
import { Button } from "../ui/shadcn/button";

const AuthMenu = () => {

    const { data } = useSession();

    const [showDropdown, setShowDropdown] = useState(false); // Toggles visibility of the auth dropdown menu

    // Function to handle user sign-in (using Descope)
    const handleSignIn = () => {
      signIn("descope");
    };

    // Function to handle user sign-out (using Descope)
    const handleLogout = () => {
      signOut("descope");
    };

    // Function to toggle the dropdown menu for authenticated users
    const handleShowAndCloseAuthMenu = () => {
      setShowDropdown(!showDropdown); // Toggles the dropdown visibility
    };

    return (
        <div className={`mx-2 w-9 h-9 lg:w-[45px] ${!data?.user && "mr-9"}`}>
            {data ? (
              // Authenticated User Dropdown
              <div >
                <Image
                  src={data?.user?.image}
                  width={40}
                  height={40}
                  alt="user icon"
                  className="cursor-pointer rounded-full hover:scale-105 opacity-90 hover:opacity-100 transition-all duration-200"
                  onClick={handleShowAndCloseAuthMenu} // Toggles dropdown visibility
                />
                {/* Dropdown Menu */}
                <div
                  className={`absolute ${
                    showDropdown ? "opacity-100 block" : "opacity-0 hidden"
                  } top-[70px] right-28 bg-background-color rounded-lg text-primary px-3 shadow-md`}
                >
                  <h1 className="text-center mb-4 p-1 pb-2 mt-2">{data?.user?.name}</h1>
                  <h2 className="flex items-center gap-3 text-sm mb-3 mr-2 hover:text-gray-400 dark:hover:text-primary transition-all duration-500 cursor-pointer">
                    <User className="h-5 w-5 self-end" />
                    Account
                  </h2>
                  <button
                    onClick={handleLogout} // Handles logout action
                    className="flex items-center gap-3 text-sm mb-4 mr-2 hover:text-gray-400 dark:hover:text-primary transition-all duration-500 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Login Button for Unauthenticated Users
              <Button
                onClick={handleSignIn} // Handles sign-in action
                className="rounded-full text-white hover:bg-sky-600 shadow-none cursor-pointer"
              >
                Login
              </Button>
            )}
        </div>
    );
}

export default AuthMenu;
