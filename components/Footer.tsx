import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-8 px-4 md:px-8 lg:px-16 flex flex-wrap justify-between items-start text-gray-700">
      {/* Powered By Section */}
      <div className="mb-6 md:mb-0 w-full md:w-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Powered By</h4>
        <Link href="https://www.bztradefairs.com" target="_blank">
          <Image
            src="/logo/logo.png"
            alt="BZ Trade Fairs Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Our Company Section */}
      <div className="mb-6 md:mb-0 w-full md:w-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Our Company</h4>
        <ul>
          <li className="mb-2">
            <Link href="/about-us" className="hover:text-blue-600 transition-colors duration-200">About Us</Link>
          </li>
          <li className="mb-2">
            <Link href="/partners" className="hover:text-blue-600 transition-colors duration-200">Partners</Link>
          </li>
          <li className="mb-2">
            <Link href="/contact-us" className="hover:text-blue-600 transition-colors duration-200">Contact Us</Link>
          </li>
        </ul>
      </div>

      {/* Legal Section */}
      <div className="mb-6 md:mb-0 w-full md:w-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Legal</h4>
        <ul>
          <li className="mb-2">
            <Link href="/terms-conditions" className="hover:text-blue-600 transition-colors duration-200">Terms & Conditions</Link>
          </li>
          <li className="mb-2">
            <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors duration-200">Privacy Policy</Link>
          </li>
          <li className="mb-2">
            <Link href="/cookies-policy" className="hover:text-blue-600 transition-colors duration-200">Cookies Policy</Link>
          </li>
        </ul>
      </div>

      {/* Connect with us Section */}
      <div className="w-full md:w-auto">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Connect with us</h4>
        <div className="flex space-x-4 text-gray-700">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF className="h-6 w-6 hover:text-blue-600 transition-colors duration-200" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="h-6 w-6 hover:text-blue-400 transition-colors duration-200" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="h-6 w-6 hover:text-pink-600 transition-colors duration-200" />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn className="h-6 w-6 hover:text-blue-700 transition-colors duration-200" />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="h-6 w-6 hover:text-red-600 transition-colors duration-200" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
