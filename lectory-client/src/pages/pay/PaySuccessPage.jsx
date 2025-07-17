import React from "react";
import { Footer } from "../sections/Footer";
import { NavbarLightDefault } from "../sections/NavbarLightDefault";
import { PaySuccess } from "../sections/Pay";
import "../../assets/css/page.css";

export const PayPageSuccess = () => {
  return (
    <div className="page" data-model-id="2823:13576">
      <NavbarLightDefault />
      <Footer />
      <PaySuccess />
    </div>
  );
};

export default PayPageSuccess;
