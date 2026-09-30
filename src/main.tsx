import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { AdminPage } from "./AdminPage";
import App from "./App";
import { FirstPage } from "./FirstPage";
import "./index.css";

const pages: Record<string, ComponentType> = {
  "/first": FirstPage,
  "/admin": AdminPage,
};
const Page = pages[location.pathname] ?? App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
