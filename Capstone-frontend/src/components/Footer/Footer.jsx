import React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";

const Footer = () => {
  const { theme } = useSelector((state) => state.theme || { theme: "light" });

  return (
    <footer
      className={clsx(
        "p-2 shadow-md",
        theme === "light" ? "bg-purple-600 text-white" : "bg-black text-white"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              Offriamo soluzioni di alto livello per problemi tecnologici, dalle
              riparazioni hardware alla sicurezza informatica.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/login.php/"
                className="hover:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.482v-9.294H9.69v-3.622h3.117V8.413c0-3.1 1.893-4.787 4.658-4.787 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.311h3.588l-.467 3.622h-3.121V24h6.116C23.406 24 24 23.406 24 22.675V1.325C24 .593 23.406 0 22.675 0z" />
                </svg>
              </a>
              <a
                href="https://x.com/i/flow/login?input_flow_data=%7B%22requested_variant%22%3A%22eyJsYW5nIjoiaXQifQ%3D%3D%22%7D"
                className="hover:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.937 4.937 0 0 0 2.165-2.723 9.864 9.864 0 0 1-3.127 1.195 4.92 4.92 0 0 0-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.098a4.902 4.902 0 0 1-2.228-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.902 4.902 0 0 1-2.224.084 4.937 4.937 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.102c-.397 0-.79-.023-1.175-.069a13.936 13.936 0 0 0 7.548 2.212c9.142 0 14.307-7.721 14.307-14.426 0-.22-.005-.439-.015-.658A10.16 10.16 0 0 0 24 4.557z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/"
                className="hover:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.616 3.184C18.537 2.276 17.157 2 15.835 2H8.165C6.843 2 5.463 2.276 4.384 3.184 3.242 4.173 3 5.54 3 7.081v9.838c0 1.542.242 2.908 1.384 3.897 1.079.909 2.459 1.184 3.781 1.184h7.67c1.322 0 2.702-.275 3.781-1.184C20.758 19.827 21 18.461 21 16.919V7.081c0-1.541-.242-2.908-1.384-3.897zM15 11l-5 3V8l5 3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/accounts/login/"
                className="hover:text-gray-400"
              >
                <a
                  href="https://www.instagram.com/accounts/login/"
                  className="hover:text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="w-6 h-6"
                    fill="white"
                  >
                    <path
                      d="M11.5 15.5h-7a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4z"
                      fill="white "
                    ></path>
                    <circle cx="8" cy="8" r="3.5" fill="purple"></circle>
                    <circle cx="12.5" cy="3.5" r=".5" fill="purple"></circle>
                  </svg>
                </a>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; 2024 ResolveTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
