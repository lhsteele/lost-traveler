import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CarouselComponent from "./Carousel/CarouselComponent";
import Header from "./Header/Header";
import Admin from "./Admin/Admin";
import { useState } from "react";
import AuthModal from "./AuthModal/AuthModal";

function App() {
  const [showModal, setShowModal] = useState(false);
  const handleAdminIconClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <button className="admin-icon-btn" onClick={handleAdminIconClick}>
          <span className="material-symbols-outlined admin-icon">
            admin_panel_settings
          </span>
        </button>
        <Header />
        <Routes>
          <Route path={"/"} element={<CarouselComponent />} />
          <Route path={"/admin"} element={<Admin />} />
        </Routes>
        {showModal && <AuthModal onClose={handleCloseModal} />}
      </div>
    </BrowserRouter>
  );
}

export default App;
