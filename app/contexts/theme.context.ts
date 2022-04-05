import React, { createContext, useContext, useState, useEffect } from 'react';

export type StyleType = "light"|"dark"|string
export type ThemeType = Record<string, StyleType>; 

export const ThemeContext = createContext({theme: "light"}: ThemeType);

export const [ThemeState, setThemeState] = useState("light" as StyleType);

useEffect(() => {
setThemeState()
}, [ThemeState]);
function ThemeProvider({theme, children}: {theme: StyleType, children: React.ReactNode}) {
 return (
   <ThemeContext.Provider value={theme}>
     <Header> Menu </Header>
     {children}
     <Footer />
   </ThemeContext.Provider>
 );
}

function Header() {
 const theme = useContext(ThemeContext);
 return (
   <div>Theme is <b>{ theme }</b></div>
 );
}

function Footer() {
 return (
   <ThemeContext.Consumer>
     { theme => (
       <div>Theme is <b>{ theme }</b></div>
     ) }
   </ThemeContext.Consumer>
 );
}
