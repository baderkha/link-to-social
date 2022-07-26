import React from "react"
import { MaterialUINav } from "material-ui-responsive-nav"
import { Logo } from "./Logo"

import { Input, ExitToApp  , PermIdentityTwoTone} from "@material-ui/icons"



export const NavBar = ({ isLoggedIn = false }) => {
  const externalLinks = [
    {
      label: "Profile",
      icon: PermIdentityTwoTone,
      link: "/profile"
    }
  ]
  const links = {
    internal: externalLinks
  }
  return (

      <MaterialUINav

        global={{
          siteTitle: " ",
          mobileBreakpoint: "xs",
        }}
        navbarConfig={{
          color: "primary",
          elevate: false,
          alignLinksRight: true,
          logo: <Logo size={"small"} white_color={true} />,
        }}
        mobileMenuConfig={{
          slideTransition: true,
        }}
        links={links}
      />
    
  )
}