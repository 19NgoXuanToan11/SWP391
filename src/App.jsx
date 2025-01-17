import "./global.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <SiteHeader />
      <main>
        <ScrollRestoration />
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
