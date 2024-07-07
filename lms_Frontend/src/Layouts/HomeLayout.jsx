import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const HomeLayout = ({ children }) => {
   const changeWidth = () => {
      const drawerSide = document.getElementByClassName("drawer-side");
      drawerSide[0].style.width = 0;
   };
   const hideDrawer = () => {
      const element = docimnet.getElementByClassName("drawer-toggle");
      element[0].checked = false;
      changeWidth();
   };

   return (
      <div className="min-h-[90vh]">
         <div className="drawer absolute left-0 z-50 w-fit">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
               {/* Page content here */}
               <label htmlFor="my-drawer" className="cursor-pointer relative">
                  <FiMenu
                     onClick={changeWidth}
                     size={"32px"}
                     className="font-bold text-white m-4"
                  />
               </label>
            </div>
            <div className="drawer-size w-0">
               <label htmlFor="my-drawer" className="drawer-overlay">
                  <ul className="menu p-4 w-48 md:w-80 bg-base-100 text-base-cotent relative">
                     <li className="w-fit absolute right-2 z-50">
                        <button onClick={hideDrawer}>
                           <AiFillCloseCircle />
                        </button>
                     </li>
                     <li>
                        <Link to="/">Home</Link>
                     </li>
                     <li>
                        <Link to="/courses">All Courses</Link>
                     </li>
                     <li>
                        <Link to="/contact">Contact Us</Link>
                     </li>
                     <li>
                        <Link to="/about">About Us</Link>
                     </li>
                  </ul>
               </label>
            </div>
         </div>

         {children}
      </div>
   );
};

export default HomeLayout;
