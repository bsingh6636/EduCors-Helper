import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./context";
import { Footer, Header, RouteEffects } from "./components/Layout";
import Home from "./pages/Home";

const Playground = lazy(() => import("./pages/Playground"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const Info = lazy(() => import("./pages/Info"));
export default function App() {
  return (
    <AppProvider>
      <RouteEffects />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense
          fallback={
            <div className="shell page-loading" role="status">
              Loading the workbench…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signIn" element={<Auth mode="signin" />} />
            <Route path="/signUp" element={<Auth mode="signup" />} />
            {["about", "help", "contact", "privacy"].map((page) => (
              <Route
                key={page}
                path={"/" + page}
                element={<Info page={page} />}
              />
            ))}
            <Route path="*" element={<Info page="missing" />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </AppProvider>
  );
}
