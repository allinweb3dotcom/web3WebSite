import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import AnalysisPage from './pages/AnalysisPage';
import ToolsPage from './pages/ToolsPage';
import EducationPage from './pages/EducationPage';
import TutorialsPage from './pages/TutorialsPage';
import ProductsPage from './pages/ProductsPage';
import AiChatPage from './pages/AiChatPage';
import RugCheckPage from './pages/RugCheckPage';
import BnbRugCheckPage from './pages/BnbRugCheckPage.tsx';
import EthRugCheckPage from './pages/EthRugCheckPage.tsx';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative">
        <div className="fixed inset-0 z-0">
          <AnimatedBackground />
        </div>
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/aichat" element={<AiChatPage />} />
            <Route path="/rugcheck" element={<RugCheckPage />} />
            <Route path="/bnbrugcheck" element={<BnbRugCheckPage />} />
            <Route path="/ethrugcheck" element={<EthRugCheckPage />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
