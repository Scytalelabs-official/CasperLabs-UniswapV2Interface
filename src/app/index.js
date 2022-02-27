import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeContext } from './new/contexts/ThemeContext'

import { Home } from './new/pages/Home'
export function App() {
  return (
    <>
      <ThemeContext>
        <BrowserRouter>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route exact path="/pool" >
              <div>pool</div>
            </Route>
            <Route exact path="/pool/addLiquidity">
              <div>add liquidity</div>
            </Route>
            <Route exact path="/pool/removeLiquidity/:tokenAAddress/:tokenBAddress"  >
              <div>remove liquidity</div>
            </Route>
            <Route path="/swap" >
              <div>swap</div>
            </Route>
            <Route path="/tokens" >
              <div>token</div>
            </Route>
            <Route path="/pairs">
              <div>pairs</div>
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeContext>
    </>
  );
}

// export function App() {

//   const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
//     if (path === "/pool") {
//       return <Route component={Pool} />;
//     } else if (path === "/pool/addLiquidity") {
//       return <Route component={AddLiquidity} />
//     } else if (path === "/pool/removeLiquidity") {
//       return <Route component={RemoveLiquidity} />
//     } else if (path === "/swap") {
//       return <Route component={Swap} />;
//     } else if (path === "/tokens") {
//       return <Route component={Tokens} />;
//     } else if (path === "/pairs") {
//       return <Route component={Pairs} />;
//     } else {
//       return <Route component={<div>home</div>} />;
//     }
//   };

//   return (
//     <SnackbarProvider maxSnack={3}>
//       <BrowserRouter>
//         <Switch>
//           <LoginRegisterRedirectCheck exact path="/" />
//           {/* <LoginRegisterRedirectCheck exact path="/login" /> */}
//           <LoginRegisterRedirectCheck exact path="/register" />
//           <LoginRegisterRedirectCheck exact path="/marketPlace" />
//           <LoginRegisterRedirectCheck exact path="/admin-login" />
//           <LoginRegisterRedirectCheck exact path="/login" />
//           {/* <LoginRegisterRedirectCheck exact path="/" /> */}

//           <Route exact path="/pool" component={Pool} />
//           <Route exact path="/pool/addLiquidity" component={AddLiquidity} />
//           <Route exact path="/pool/removeLiquidity/:tokenAAddress/:tokenBAddress" component={RemoveLiquidity} />
//           <Route path="/swap" component={Swap} />
//           <Route path="/tokens" component={Tokens} />
//           <Route path="/pairs" component={Pairs} />

//         </Switch>
//       </BrowserRouter>
//     </SnackbarProvider>
//   );
// }