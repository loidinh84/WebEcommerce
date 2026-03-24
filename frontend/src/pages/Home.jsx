import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import * as Icons from "../assets/icons/index";
import * as Images from "../assets/images/index";

function Home() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto mt-4">
        {/* Nội dung chính của ứng dụng sẽ được đặt ở đây */}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
