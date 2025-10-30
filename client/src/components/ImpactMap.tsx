import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { cn } from "@/lib/utils";

// Fix Leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Custom solar panel marker icon
const solarIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/5734/5734378.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Fly to bounds component
function SetViewToBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  
  return null;
}

interface Installation {
  id: number;
  village: string;
  coordinates: L.LatLngTuple;
  date: string;
  households: number;
  kwhGenerated: number;
  co2Saved: number;
  moneySaved: number;
  imageUrls: string[];
  videoUrls: string[];
}

export default function ImpactMap() {
  const [activeInstallation, setActiveInstallation] = useState<Installation | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  // Sample data - in a real application, this would come from an API
  const installations: Installation[] = [
    {
      id: 1,
      village: "Khairpur Mirs",
      coordinates: [27.5293, 68.7593],
      date: "March 15, 2024",
      households: 11,
      kwhGenerated: 240,
      co2Saved: 320,
      moneySaved: 35000,
      imageUrls: [
        "https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg",
        "https://images.pexels.com/photos/9875442/pexels-photo-9875442.jpeg"
      ],
      videoUrls: [
        "https://www.youtube.com/embed/qM_XUa6Mj7s",
        "https://www.youtube.com/embed/GBcFI5XbMwU"
      ]
    }
  ];

  // Calculate bounds for all installations
  const allCoordinates = installations.map(i => i.coordinates);
  const bounds = L.latLngBounds(allCoordinates.map(coord => L.latLng(coord[0], coord[1])));
  
  // Extend bounds slightly for better visibility
  const extendedBounds = bounds.pad(0.3);

  const handleNextMedia = () => {
    const mediaUrls = mediaType === 'photo' 
      ? activeInstallation?.imageUrls 
      : activeInstallation?.videoUrls;
    
    if (mediaUrls && mediaUrls.length > 0) {
      setCurrentMediaIndex((currentMediaIndex + 1) % mediaUrls.length);
    }
  };

  const handlePrevMedia = () => {
    const mediaUrls = mediaType === 'photo' 
      ? activeInstallation?.imageUrls 
      : activeInstallation?.videoUrls;
    
    if (mediaUrls && mediaUrls.length > 0) {
      setCurrentMediaIndex((currentMediaIndex - 1 + mediaUrls.length) % mediaUrls.length);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <MapContainer 
        center={[25.5, 69.5]} 
        zoom={7} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewToBounds bounds={extendedBounds} />
        
        {installations.map((installation) => (
          <Marker 
            key={installation.id}
            position={installation.coordinates}
            icon={solarIcon}
            eventHandlers={{
              click: () => {
                setActiveInstallation(installation);
                setCurrentMediaIndex(0); // Reset media index when selecting a new installation
              }
            }}
          >
            <Popup 
              closeButton={true} 
              minWidth={300}
              maxWidth={500}
              className="custom-popup"
            >
              <div className="py-2">
                <h3 className="font-heading font-bold text-xl mb-2">{installation.village}</h3>
                <div className="mb-4">
                  <div className="flex justify-between gap-2 mb-2">
                    <button 
                      className={cn(
                        "flex-1 py-1 px-3 rounded-md font-medium text-sm transition-colors",
                        mediaType === 'photo' 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      )}
                      onClick={() => {
                        setMediaType('photo');
                        setCurrentMediaIndex(0);
                      }}
                    >
                      Photos
                    </button>
                    <button 
                      className={cn(
                        "flex-1 py-1 px-3 rounded-md font-medium text-sm transition-colors",
                        mediaType === 'video' 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      )}
                      onClick={() => {
                        setMediaType('video');
                        setCurrentMediaIndex(0);
                      }}
                    >
                      Videos
                    </button>
                  </div>
                  
                  <div className="relative min-h-[200px] bg-gray-100 rounded-lg overflow-hidden">
                    {mediaType === 'photo' ? (
                      <>
                        <img 
                          src={installation.imageUrls[currentMediaIndex]} 
                          alt={`Solar installation in ${installation.village}`}
                          className="w-full h-[200px] object-cover"
                        />
                        {installation.imageUrls.length > 1 && (
                          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-between px-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevMedia();
                              }}
                              className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextMedia();
                              }}
                              className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {currentMediaIndex + 1}/{installation.imageUrls.length}
                        </div>
                      </>
                    ) : (
                      <>
                        <iframe
                          src={installation.videoUrls[currentMediaIndex]}
                          title={`Solar installation video for ${installation.village}`}
                          className="w-full h-[200px]"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        {installation.videoUrls.length > 1 && (
                          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevMedia();
                              }}
                              className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors pointer-events-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextMedia();
                              }}
                              className="bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors pointer-events-auto"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {currentMediaIndex + 1}/{installation.videoUrls.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-sm mb-2">
                  <span className="font-medium">Installation Date:</span> {installation.date}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Households Powered</div>
                    <div className="text-lg font-bold text-blue-800">{installation.households}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-xs text-green-600 font-medium">kWh Generated</div>
                    <div className="text-lg font-bold text-green-800">{formatNumber(installation.kwhGenerated)}</div>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <div className="text-xs text-amber-600 font-medium">Estimated CO₂ Saved (kg)</div>
                    <div className="text-lg font-bold text-amber-800">{formatNumber(installation.co2Saved)}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-xs text-purple-600 font-medium">Money Saved (PKR)</div>
                    <div className="text-lg font-bold text-purple-800">{formatNumber(installation.moneySaved)}</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a 
                    href="#donate" 
                    className="block bg-primary hover:bg-primary/90 text-white font-heading font-medium text-center px-4 py-2 rounded-md transition w-full"
                  >
                    Support This Community
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Custom CSS for map popups */}
      <style>{`
        :global(.custom-popup .leaflet-popup-content-wrapper) {
          border-radius: 0.75rem;
          padding: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        :global(.custom-popup .leaflet-popup-content) {
          margin: 0;
          width: 320px !important;
        }
        
        :global(.custom-popup .leaflet-popup-tip) {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
}