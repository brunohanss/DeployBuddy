import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ContainerPage from "./pages/Instance";
import ContainersPage from "./pages/Instances";
import LandingPage from "./pages/Landing";
import Signin from "./pages/Signin";

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/instances/:id" element={<ContainerPage />} />
        <Route path="/instances" element={<ContainersPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
