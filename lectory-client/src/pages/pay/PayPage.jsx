import React from "react";
import { Footer } from "../sections/Footer";
import { NavbarLightDefault } from "../sections/NavbarLightDefault";
import { Pay } from "../sections/Pay";
import "../../assets/css/page.css";
import { useSearchParams } from "react-router-dom";

export const PayPage = () => {
  return (
    <div className="page" data-model-id="2823:13576">
      <NavbarLightDefault />
      <Footer />
      <Pay />
    </div>
  );
};

export default PayPage;
