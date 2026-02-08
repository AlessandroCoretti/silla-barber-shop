import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Team from './components/Team';
import Services from './components/Services';
import Products from './components/Products';
import Coffee from './components/Coffee';
import News from './components/News';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {

  useEffect(() => {
    // Global animations setup if needed
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Intro />
        <Team />
        <Services />
        <Products />
        <Coffee />
        <News />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

export default App;
