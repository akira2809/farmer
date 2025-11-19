'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getAddressFromCoords } from '@/utils/mapUtils';

// Fix icon mặc định của Leaflet trong Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component con để xử lý sự kiện click
function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} icon={icon}></Marker>;
}

interface MapPickerProps {
  defaultLat?: number;
  defaultLng?: number;
  onAddressFound: (address: string, lat: number, lng: number) => void;
}

const MapPicker = ({
  defaultLat = 10.762622,
  defaultLng = 106.660172,
  onAddressFound,
}: MapPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoading(true);
    const address = await getAddressFromCoords(lat, lng);
    setIsLoading(false);

    if (address) {
      setSelectedAddress(address);
      onAddressFound(address, lat, lng);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="h-[300px] w-full rounded-[18px] border-2 border-[#2e8623] overflow-hidden relative shrink-0">
        <MapContainer
          center={[defaultLat, defaultLng]}
          zoom={13}
          style={{ height: '300px', width: '100%', position: 'relative' }}
          scrollWheelZoom={false}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelect} />
        </MapContainer>

        {/* Overlay loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-[1000] pointer-events-none">
            <span className="text-white font-medium bg-black/50 px-3 py-1 rounded">
              Đang lấy địa chỉ...
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 font-['Be_Vietnam_Pro']">
        Click vào bản đồ để chọn vị trí ruộng của bạn
      </p>

      {selectedAddress && (
        <div className="bg-[#ebf5ed] border border-[#2e8623] rounded-[12px] p-3">
          <p className="text-sm font-['Be_Vietnam_Pro'] text-[#191f19]">
            <span className="font-semibold">Địa chỉ đã chọn:</span> {selectedAddress}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
