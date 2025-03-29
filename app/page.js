import { 
  Hero, 
  Categories, 
  PopularServices, 
  Overview, 
  BookingSteps 
} from '../components/home'

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <PopularServices />
      <Overview />
      <BookingSteps />
    </main>
  );
}
