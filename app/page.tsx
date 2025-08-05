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

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
       <HeroSlideshow />
       <CategoryBrowse />
       <FeaturedEvents />                               
       <BrowseEventsByCity />
       <BrowseByCountry />
       <ExploreVenues />
       <FeaturedOrganizers />
       <EventReviews />
       <GetAppSection />
       <div></div>
    </div>
  );
}
