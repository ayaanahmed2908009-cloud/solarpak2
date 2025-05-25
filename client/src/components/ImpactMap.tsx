import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Define the installation data structure
interface Installation {
  id: number;
  village: string;
  coordinates: LatLngTuple;
  date: string;
  households: number;
  kwhGenerated: number;
  co2Saved: number;
  moneySaved: number;
  imageUrl: string;
}

export default function ImpactMap() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalHouseholds: 0,
    totalKwh: 0,
    totalCo2: 0,
    totalMoney: 0
  });

  // Set default icon for Leaflet markers
  useEffect(() => {
    // This is needed to properly display the marker icons in React
    const DefaultIcon = new Icon({
      iconUrl: icon,
      iconRetinaUrl: iconRetina,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // @ts-ignore - TS doesn't know about this Leaflet internal
    delete L.Icon.Default.prototype._getIconUrl;
    // @ts-ignore - Set default icon
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetina,
      iconUrl: icon,
      shadowUrl: iconShadow
    });
  }, []);

  // Load installation data
  useEffect(() => {
    // This would normally come from an API, using static data for now
    const sampleInstallations: Installation[] = [
      {
        id: 1,
        village: "Tharparkar Village",
        coordinates: [24.8950, 69.8511], // Tharparkar district
        date: "March 2023",
        households: 15,
        kwhGenerated: 4500,
        co2Saved: 2.8,
        moneySaved: 540,
        imageUrl: "https://images.unsplash.com/photo-1592833167344-45da5e0c3571?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 2,
        village: "Umerkot Community",
        coordinates: [25.3549, 69.7376], // Umerkot district
        date: "April 2023",
        households: 12,
        kwhGenerated: 3800,
        co2Saved: 2.3,
        moneySaved: 460,
        imageUrl: "https://images.unsplash.com/photo-1666045054858-b4f595016d74?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 3,
        village: "Mirpurkhas Settlement",
        coordinates: [25.5260, 69.0137], // Mirpurkhas district
        date: "June 2023",
        households: 20,
        kwhGenerated: 6200,
        co2Saved: 3.9,
        moneySaved: 750,
        imageUrl: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 4,
        village: "Sanghar Community",
        coordinates: [26.0414, 68.9480], // Sanghar district
        date: "August 2023",
        households: 18,
        kwhGenerated: 5400,
        co2Saved: 3.4,
        moneySaved: 650,
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 5,
        village: "Khairpur Village",
        coordinates: [27.5295, 68.7591], // Khairpur district
        date: "October 2023",
        households: 25,
        kwhGenerated: 7500,
        co2Saved: 4.7,
        moneySaved: 900,
        imageUrl: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      }
    ];

    // Calculate total stats
    const totalHouseholds = sampleInstallations.reduce((sum, installation) => sum + installation.households, 0);
    const totalKwh = sampleInstallations.reduce((sum, installation) => sum + installation.kwhGenerated, 0);
    const totalCo2 = sampleInstallations.reduce((sum, installation) => sum + installation.co2Saved, 0);
    const totalMoney = sampleInstallations.reduce((sum, installation) => sum + installation.moneySaved, 0);

    setTotalStats({
      totalHouseholds,
      totalKwh,
      totalCo2,
      totalMoney
    });

    setInstallations(sampleInstallations);
    setIsLoading(false);
  }, []);

  // Create a custom marker icon for solar installations
  const solarIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4056/4056236.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading impact map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="impact-map-container">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary">{totalStats.totalHouseholds}</div>
          <div className="text-gray-500 text-sm">Households Powered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary">{totalStats.totalKwh.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">kWh Generated</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary">{totalStats.totalCo2.toFixed(1)}</div>
          <div className="text-gray-500 text-sm">Tons CO₂ Saved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-primary">${totalStats.totalMoney.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Money Saved</div>
        </div>
      </div>

      <div className="h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer 
          center={[25.8943, 68.5247]} // Center of Sindh province
          zoom={7} 
          style={{ height: '100%', width: '100%' }} 
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {installations.map(installation => (
            <Marker 
              key={installation.id} 
              position={installation.coordinates}
              icon={solarIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="font-bold text-lg mb-1">{installation.village}</h3>
                  <p className="text-sm text-gray-600 mb-2">Installed: {installation.date}</p>
                  
                  <div className="popup-image mb-2">
                    <img 
                      src={installation.imageUrl} 
                      alt={`Solar installation in ${installation.village}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">Households:</span> {installation.households}
                    </div>
                    <div>
                      <span className="font-semibold">kWh Generated:</span> {installation.kwhGenerated}
                    </div>
                    <div>
                      <span className="font-semibold">CO₂ Saved:</span> {installation.co2Saved} tons
                    </div>
                    <div>
                      <span className="font-semibold">Money Saved:</span> ${installation.moneySaved}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 bg-primary/5 p-4 rounded-lg border border-primary/10 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Note:</span> This map shows our solar panel installations across Sindh province. 
          Click on the markers to see details about each installation including the number of households 
          benefiting, energy generated, and environmental impact.
        </p>
      </div>
    </div>
  );
}