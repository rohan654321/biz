// import Image from "next/image";
// import EventCalendar from "./components/Eventcalander";
import EventReviews from "@/components/EventReviews";
import BrowseByCountry from "../components/browse-by-country";
import BrowseEventsByCity from "../components/BrowseEventsByCity";
import CategoryBrowse from "../components/CategoryBrowse";
import ExploreVenues from "../components/ExploreVenues";
import FeaturedEvents from "../components/FeaturedEvents";
import FeaturedOrganizers from "../components/FeaturedOrganizers";
import HeroSlideshow from "../components/HeroSlideshow";
import GetAppSection from "@/components/GetAppSection";
import ScrollBanner from "@/components/BannerCarousel";
import BannerCarousel from "@/components/BannerCarousel";
import ImageBannerCarousel from "@/components/BannerCarousel";
import Navbar from "@/components/navbar";
  const bannerImages = [
    "/banners/banner1.jpg",
    "/banners/banner2.png",
    "/banners/banner3.png",
  ]


export default function Home() {
  return (
    <div>
      
    <div className="bg-white min-h-screen">
       <HeroSlideshow />
       <CategoryBrowse />
        <div className="my-10">
        <ImageBannerCarousel images={bannerImages} />
      </div>
       <FeaturedEvents />                               
       <BrowseEventsByCity />
         <div className="my-10">
        <ImageBannerCarousel images={bannerImages} />
      </div>
       <BrowseByCountry />
       <ExploreVenues />
       <FeaturedOrganizers />
       <EventReviews />
       <GetAppSection />
       <div></div>
    </div>
    </div>
  );
}
