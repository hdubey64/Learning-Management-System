import "./App.css";
import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import HomeLayout from "./Layouts/HomeLayout";

function App() {
   return (
      <>
         {/*
         <Routes>
            <Route path="/" element={<Home />}></Route>{" "}
         </Routes> */}
         <HomeLayout />
      </>
   );
}

export default App;
