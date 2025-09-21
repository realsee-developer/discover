import { Carousel } from "@/components/custom/home/Carousel";
import { SearchFilter } from "@/components/custom/home/SearchFilter";
import { TourGrid } from "@/components/custom/home/TourGrid";
import { Photographers } from "@/components/custom/home/Photographers";
import { JoinCTA } from "@/components/custom/home/JoinCTA";

export default async function Home() {
  return (
    <main className="main-content-wrapper">
      <Carousel />
      <SearchFilter />
      <TourGrid />
      <Photographers />
      <JoinCTA />
    </main>
  );
}
