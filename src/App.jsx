import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TeamPage from './pages/TeamPage';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // Global animations setup if needed
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
