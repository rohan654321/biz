"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Search, User } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [exploreOpen, setExploreOpen] = useState(false);  
  const [country, setCountry] = useState('IND');

  const router = useRouter();

  const toggleExplore = () => setExploreOpen((prev) => !prev);

  const { data: session } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  const handleAddevent = async () => {
    if (!session) {
      alert("You are not logged in. Please login as an organizer.");
      router.push("/login");
      return;
    }

    const role = session.user?.role;

    if (role === "organizer") {
      router.push("/organizer-dashboard");
    } else {
      const confirmed = window.confirm(
        `You are logged in as '${role}'.\n\nPlease login as an organizer to access this page.\n\nClick OK to logout and login as an organizer, or Cancel to stay logged in.`
      );
      if (confirmed) {
        await signOut({ redirect: false });
        router.push("/login");
      }
    }
  };


  const handleDashboard = () => {
    const role = session?.user?.role; // 👈 adjust this depending on how your role is stored

    if (role === "ORGANIZER") {
      router.push(`/organizer-dashboard/${session?.user?.id}`);
    } else if (role === "superadmin") {
      router.push("/admin-dashboard");
    } else if (role === "ATTENDEE") {
      router.push(`/dashboard/${session?.user?.id}`);
    }else {
      router.push("/login"); // fallback route
    }
  };


  const handleClick = () => {
    setShowMenu(!showMenu)
  }

  const handleLogin = () => {
    signIn(undefined, { callbackUrl: "/" }) // Redirect after login
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }) // Redirect after logout
  }


  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between h-20 items-center">
          {/* Left group: logo + Explore */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="inline-block">
              <div className="flex items-center ">
                <Image
                  src="/logo/bizlogo.png"
                  alt="BizTradeFairs.com"
                  width={160}  // Increase width
                  height={80}  // Adjust proportionally
                  className="h-42 w-auto " // Optional for responsiveness
                />
              </div>
            </Link>

            <div className="relative">
              <button
                onClick={toggleExplore}
                className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span>Explore</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {exploreOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <Link href="/trade-fairs"><p className="block px-4 py-2 hover:bg-gray-100">Trade Fairs</p></Link>
                    </li>
                    <li>
                      <Link href="/conferences"><p className="block px-4 py-2 hover:bg-gray-100">Conferences</p></Link>
                    </li>
                    <li>
                      <Link href="/webinars"><p className="block px-4 py-2 hover:bg-gray-100">Webinars</p></Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Center group: search bar */}
          <div className="w-full max-w-md flex-1  bg-gray-200">
            <div className="relative ">
              <input
                type="text"
                placeholder="Topic, Event or Location"
                className="w-full text-black py-2 pl-10 pr-12"
              />
              <Search className="w-5 h-5  absolute right-5 top-1/2 transform -translate-y-1/2 " />
            </div>
          </div>

          {/* Right group: links + country selector + profile */}
          <div className="flex items-center space-x-6">
            <Link href="/event">
              <p className="text-gray-700 hover:text-gray-900">Top 10 Must Visit</p>
            </Link>
            <Link href="/speakers">
              <p className="text-gray-700 hover:text-gray-900">Speakers</p>
            </Link>

            <p onClick={handleAddevent} className="text-gray-700 hover:text-gray-900  cursor-pointer">Add Event</p>


            {/* <div className="flex items-center space-x-1">
               <Image
                src={`/flags/${country.toLowerCase()}.svg`}
                alt={country}
                width={24}
                height={16}
              /> 
              <span className="text-gray-700">{country}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div> */}

            <div className="relative inline-block text-left">
              <button
                onClick={handleClick}
                className="p-2 rounded-full bg-[#002C71] text-white hover:bg-gray-100 focus:outline-none"
              >
                <User className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                  {session ? (
                    <>
                      <button
                        onClick={handleDashboard}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 text-gray-800"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-red-100 text-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-blue-100 text-blue-600"
                    >
                      Login
                    </button>

                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}