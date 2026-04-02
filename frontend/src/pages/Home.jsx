import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Benefits from '../components/home/Benefits';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Services from '../components/home/Services';
import Testimonials from '../components/home/Testimonials';
import DeliveryInfo from '../components/home/DeliveryInfo';

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <Benefits />
      <FeaturedProducts />
      <Services />
      <DeliveryInfo />
      <Testimonials />
    </div>
  );
};

export default Home;