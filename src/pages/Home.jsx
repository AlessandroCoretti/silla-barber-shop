import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Intro from '../components/Intro';
import Team from '../components/Team';
import Services from '../components/Services';
import Products from '../components/Products';
import Coffee from '../components/Coffee';
import News from '../components/News';
import Reviews from '../components/Reviews';

const Home = () => {
    useEffect(() => {
        // Any page-specific initialization can go here
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Hero />
            <Intro />
            <Team showDescription={false} />
            <Services />
            <Products />
            <Coffee />
            <News />
            <Reviews />
        </>
    );
};

export default Home;
