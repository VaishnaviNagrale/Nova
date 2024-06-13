import React from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Aside from "./components/Aside/Aside.jsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex flex-col justify-center p-2">
        <Header />
        <main className="w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <Aside />
            <Outlet/>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
