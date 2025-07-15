import React from "react";
import { NavbarLightDefaultWrapper } from "../../components/NavbarLightDefaultWrapper";
import "../../assets/css/navbarLightDefault.css";

export const NavbarLightDefault = () => {
  return (
    <NavbarLightDefaultWrapper
      className="navbar-light-default-instance"
      divClassName="navbar-light-default-instance-2"
      divClassNameOverride="navbar-light-default-instance-2"
      logoDivClassName="design-component-instance-node"
      logoText="Lectory"
    />
  );
};

export default NavbarLightDefault;