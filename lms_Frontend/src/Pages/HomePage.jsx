import React from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link } from "react-router-dom";
import HomePageImage from "../assets/images/homePageMainImage.png";

const HomePage = () => {
   return (
      <HomeLayout>
         <div className="pt-10 mx-16 h-[90vh] text-white flex items-center justify-center gap-10">
            <div className="w-1/2 space-y-6">
               <h1 className="text-5xl font-semibold ">
                  Find Out Best{" "}
                  <span className="text-yellow-500 font-bold">
                     Online Courses
                  </span>
               </h1>
               <p className="text-xl text-gray-200">
                  {" "}
                  We have a large library of Courses taught by highly skilled
                  qualified faculties at a very affordable cost
               </p>

               <div className="space-x-6">
                  <Link to="/courses">
                     <button
                        className="bg-yellow-500
                     px-5 py-3 rounded-md font-semibold text-la cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300"
                     >
                        Explore Courses
                     </button>
                  </Link>
                  <Link to="/contact">
                     <button
                        className=" border border-yellow-500
                  px-5 py-3 rounded-md font-semibold text-la cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300"
                     >
                        Contact Us
                     </button>
                  </Link>
               </div>
            </div>
            <div className="w-1/2 flex items-center justify-center">
               <img src={HomePageImage} alt="homePage image" />
            </div>
         </div>
      </HomeLayout>
   );
};

export default HomePage;
