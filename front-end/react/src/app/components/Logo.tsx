import React from "react"

const sizes = {
  small :"144",
  large : "256",
  full :""
}


export const Logo = ({size , white_color = false }) => {
    const clickHandler = ()=> {
        window.location.href = "http://localhost:3000/"
    }

    const src = !white_color ? "/logo.png" : "/logo_inverted_col.png";
    
  return ( <img src={src} width={sizes[size]} onClick={clickHandler}></img>)
}