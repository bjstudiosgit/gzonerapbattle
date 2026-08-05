import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Clients from "./Clients";
import Journey from "./Journey";
import Values from "./Values";
import Contact from "./Contact";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/values" element={<Values />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
