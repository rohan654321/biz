import React, { useState } from 'react';

// interface HotelOffer {
//   id: number;
//   name: string;
//   price: number;
//   rating: number;
//   distance: string;
//   amenities: string[];
//   image: string;
//   description: string;
// }

// interface ShuttleInfo {
//   route: string;
//   schedule: string[];
//   frequency: string;
// }

// interface TravelDeskInfo {
//   hours: string;
//   phone: string;
//   email: string;
//   location: string;
// }

const TravelAccommodation: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'hotels' | 'travel' | 'shuttle'>('hotels');
//   const [selectedHotel, setSelectedHotel] = useState<number | null>(null);

//   const partnerHotels: HotelOffer[] = [
//     {
//       id: 1,
//       name: "Grand Plaza Hotel",
//       price: 159,
//       rating: 4.5,
//       distance: "0.3 miles from venue",
//       amenities: ["Free WiFi", "Breakfast", "Pool", "Gym"],
//       image: "/hotel1.jpg",
//       description: "Luxury accommodations with premium amenities and exceptional service."
//     },
//     {
//       id: 2,
//       name: "Riverside Inn",
//       price: 129,
//       rating: 4.2,
//       distance: "0.5 miles from venue",
//       amenities: ["Free WiFi", "Parking", "Restaurant"],
//       image: "/hotel2.jpg",
//       description: "Comfortable rooms with beautiful river views and convenient access."
//     },
//     {
//       id: 3,
//       name: "City Center Suites",
//       price: 189,
//       rating: 4.7,
//       distance: "0.2 miles from venue",
//       amenities: ["Free WiFi", "Breakfast", "Spa", "Business Center"],
//       image: "/hotel3.jpg",
//       description: "Upscale suites in the heart of the city with premium services."
//     }
//   ];

//   const shuttleInfo: ShuttleInfo[] = [
//     {
//       route: "Airport to Hotel District",
//       schedule: ["6:00 AM", "10:00 AM", "2:00 PM", "6:00 PM", "10:00 PM"],
//       frequency: "Every 4 hours"
//     },
//     {
//       route: "Hotel District to Venue",
//       schedule: ["7:00 AM", "8:00 AM", "5:00 PM", "6:00 PM", "9:00 PM"],
//       frequency: "Peak hours: every hour"
//     }
//   ];

//   const travelDeskInfo: TravelDeskInfo = {
//     hours: "8:00 AM - 8:00 PM Daily",
//     phone: "+1 (555) 123-TRAV",
//     email: "travel@example.com",
//     location: "Main Lobby, West Entrance"
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Travel & Accommodation</h2>
      
//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`py-2 px-4 font-medium ${activeTab === 'hotels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('hotels')}
//         >
//           Partner Hotels
//         </button>
//         <button
//           className={`py-2 px-4 font-medium ${activeTab === 'travel' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('travel')}
//         >
//           Travel Desk
//         </button>
//         <button
//           className={`py-2 px-4 font-medium ${activeTab === 'shuttle' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('shuttle')}
//         >
//           Shuttle Service
//         </button>
//       </div>
      
//       {/* Content based on active tab */}
//       <div className="min-h-[400px]">
//         {activeTab === 'hotels' && (
//           <div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Partner Hotel Offers</h3>
//             <p className="text-gray-600 mb-6">Special rates available for event attendees. Book by March 31st to secure these prices.</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {partnerHotels.map((hotel) => (
//                 <div 
//                   key={hotel.id} 
//                   className={`border rounded-lg overflow-hidden shadow-md transition-all duration-200 ${selectedHotel === hotel.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
//                   onClick={() => setSelectedHotel(hotel.id)}
//                 >
//                   <div className="h-40 bg-gray-200 relative">
//                     {/* Hotel image would go here */}
//                     <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-sm font-medium py-1 px-2 rounded">
//                       ${hotel.price}/night
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="text-lg font-semibold text-gray-800">{hotel.name}</h4>
//                       <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
//                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                         {hotel.rating}
//                       </div>
//                     </div>
//                     <p className="text-gray-600 text-sm mb-3">{hotel.distance}</p>
//                     <p className="text-gray-700 text-sm mb-4">{hotel.description}</p>
                    
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {hotel.amenities.map((amenity, index) => (
//                         <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium py-1 px-2 rounded">
//                           {amenity}
//                         </span>
//                       ))}
//                     </div>
                    
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
//                       Book Now
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'travel' && (
//           <div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Travel Desk Information</h3>
//             <p className="text-gray-600 mb-6">Our travel desk is available to assist you with all your travel needs during the event.</p>
            
//             <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-2">Hours of Operation</h4>
//                   <p className="text-gray-600">{travelDeskInfo.hours}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-2">Location</h4>
//                   <p className="text-gray-600">{travelDeskInfo.location}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-2">Contact Phone</h4>
//                   <p className="text-gray-600">{travelDeskInfo.phone}</p>
//                 </div>
                
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-2">Email</h4>
//                   <p className="text-gray-600">{travelDeskInfo.email}</p>
//                 </div>
//               </div>
              
//               <div className="mt-6">
//                 <h4 className="font-medium text-gray-700 mb-2">Services Offered</h4>
//                 <ul className="list-disc list-inside text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <li>Flight bookings and changes</li>
//                   <li>Local transportation information</li>
//                   <li>Restaurant recommendations and reservations</li>
//                   <li>Tourist attraction information</li>
//                   <li>Rental car assistance</li>
//                   <li>Emergency travel assistance</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'shuttle' && (
//           <div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Shuttle Service Information</h3>
//             <p className="text-gray-600 mb-6">Complimentary shuttle service is available for all event attendees.</p>
            
//             <div className="space-y-6">
//               {shuttleInfo.map((shuttle, index) => (
//                 <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
//                   <h4 className="font-semibold text-lg text-gray-800 mb-3">{shuttle.route}</h4>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <h5 className="font-medium text-gray-700 mb-2">Schedule</h5>
//                       <ul className="text-gray-600">
//                         {shuttle.schedule.map((time, i) => (
//                           <li key={i} className="py-1">{time}</li>
//                         ))}
//                       </ul>
//                     </div>
                    
//                     <div>
//                       <h5 className="font-medium text-gray-700 mb-2">Frequency</h5>
//                       <p className="text-gray-600">{shuttle.frequency}</p>
                      
//                       <h5 className="font-medium text-gray-700 mt-4 mb-2">Pickup Locations</h5>
//                       <ul className="text-gray-600">
//                         <li className="py-1">Main Hotel Entrance</li>
//                         <li className="py-1">Conference Center West</li>
//                         <li className="py-1">Downtown Transit Center</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
//                 <h4 className="font-semibold text-lg text-gray-800 mb-2">Important Notes</h4>
//                 <ul className="list-disc list-inside text-gray-600 space-y-2">
//                   <li>Shuttle service is complimentary for all registered attendees</li>
//                   <li>Please have your event badge visible when boarding</li>
//                   <li>Service may be delayed during peak hours</li>
//                   <li>Last shuttle departs 30 minutes after the final session each day</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
    return ( <div>
        <p>Page will update Shortly</p>
    </div>
  );          
};

export default TravelAccommodation;