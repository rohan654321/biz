import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { FaInstagram } from "react-icons/fa"
import { Facebook, Twitter, Youtube } from "lucide-react"
import { MessageCircle } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo and Social Media Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo/logo.png"
                alt="BZ Trade Fairs Logo"
                width={150}
                height={60}
                className="object-contain"
              />
            </Link>

            <p className="text-gray-600 text-sm mb-4">Follow us on</p>

            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-1">
            <h4 className="text-gray-900 font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Find Events
                </Link>
              </li>
              <li>
                <Link
                  href="/venues"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Book Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/organizers"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Event Organizers
                </Link>
              </li>
              <li>
                <Link
                  href="/speakers"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Find Speakers
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitors"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Exhibitor Services
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Event Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="/registration"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Event Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Event Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/partnerships"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-1">
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Press Releases
                </Link>
              </li>
              <li>
                <Link
                  href="/partner-program"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Become Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/organizer-program"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Become Organizer
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories Column */}
          <div className="lg:col-span-1">
            <h4 className="text-gray-900 font-semibold mb-4">Event Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories/conferences"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Conferences
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/trade-shows"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Trade Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/exhibitions"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/workshops"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/seminars"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Seminars
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/networking"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Networking Events
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/webinars"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Webinars
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="lg:col-span-1">
            <h4 className="text-gray-900 font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* More Info Column */}
          <div className="lg:col-span-1">
            <h4 className="text-gray-900 font-semibold mb-4">More Info</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm mb-10"
                >
                  Event Safety
                </Link>
              </li>
            </ul>
            <div className=" bottom-6 mt-10 z-50">
          <button className="bg-[#002c71] hover:bg-teal-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 transition-colors duration-200">
            <MessageCircle className="w-5 h-5" />
            <div className="text-left">
              <div className="text-sm font-semibold">Chat with Us</div>
              <div className="text-xs opacity-90">Got questions? Just ask.</div>
            </div>
          </button>
        </div>
          </div>
          
        </div>

        {/* Chat with Us Button */}
        

        {/* Registered Office Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="mb-6">
            <h5 className="text-gray-900 font-semibold mb-2">Registered Office:</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              BZ Trade Fairs Pvt Ltd | 123, Business Center, 2nd Floor, Lane-1, Commercial District, Sector 15, Near
              Metro Station, New Delhi-110001, India, Support-+91-9876543210 | CIN: U12345DL2020PTC123456
              <br />
              Manak Event Management Pvt Ltd. is ISO 27001 & 27701 Compliance Certified. Person who may be contacted in
              case of any compliance related queries or grievances: Manoj Kumar (grievanceofficer@bztradefairs.in)
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-xs leading-relaxed">
              ** All event names, logos, and brands are property of their respective owners. All company, event and
              service names used in this website are for identification purposes only. Use of these names, logos, and
              brands does not imply endorsement.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8 text-gray-600 text-sm">Copyright © 2025 BZ Trade Fairs All rights reserved</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
