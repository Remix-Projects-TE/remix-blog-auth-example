import React, { createContext, useContext } from 'react';

export type ThemeTypes = Record<string,  
export const ThemeContext = createContext('dark');

function App() {
 return (
   <ThemeContext.Provider value="light">
     <Header> Menu </Header>
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
