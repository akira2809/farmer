"use client";

import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CloudRain, Droplets } from "lucide-react";
import { getWeatherByFarmAction } from "@/action/weatherAction";
import { getFarmsAction } from "@/action/farm";
import type { WeatherForecast } from "@/models/weather";
import type { TFarm } from "@/models/farm";
import { toast } from "sonner";

const imgFrame5 = "https://www.figma.com/api/mcp/asset/0401f921-e135-4181-a203-d0f73461e3e3";

export default function WeatherPage() {
  const [farms, setFarms] = useState<TFarm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<TFarm | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch farms on mount
  useEffect(() => {
    async function loadFarms() {
      try {
        const result = await getFarmsAction();
        console.log("Farms result:", result);
        
        if (result.success && result.data) {
          setFarms(result.data);
          
          // Auto-select first farm
          if (result.data.length > 0) {
            setSelectedFarm(result.data[0]);
          }
        } else {
          toast.error(result.error || "Không thể tải danh sách ruộng");
        }
      } catch (error) {
        console.error("Error loading farms:", error);
        toast.error("Không thể tải danh sách ruộng");
      } finally {
        setLoading(false);
      }
    }
    loadFarms();
  }, []);

  // Fetch weather when farm is selected
  useEffect(() => {
    if (!selectedFarm?.id) return;

    async function loadWeather() {
      setLoading(true);
      try {
        const result = await getWeatherByFarmAction(selectedFarm!.id);
        
        if (result.success && result.data) {
          setWeather(result.data);
        } else {
          toast.error(result.error || "Không thể tải dữ liệu thời tiết");
        }
      } catch (error) {
        console.error("Error loading weather:", error);
        toast.error("Lỗi khi tải thời tiết");
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [selectedFarm]);

  const currentDay = weather?.forecast_days?.[selectedDayIndex];

  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (weather && selectedDayIndex < weather.forecast_days.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return { day, month };
  };

  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="weather" />

      <div className="flex flex-[1_0_0] flex-col gap-[30px] md:gap-[40px] h-full items-center min-h-px min-w-px overflow-clip relative shrink-0 w-full md:ml-[60px] lg:ml-[72px]">
        {/* Farm Selector */}
        <div className="w-full px-[25px] md:px-[35px] pt-[25px]">
          <select
            value={selectedFarm?.id || ""}
            onChange={(e) => {
              const farm = farms.find((f) => f.id === e.target.value);
              setSelectedFarm(farm || null);
              setSelectedDayIndex(0);
            }}
            className="w-full max-w-md px-4 py-2 border-2 border-[#2e8623] rounded-lg bg-white font-['Be_Vietnam_Pro'] text-black"
          >
            <option value="">Chọn ruộng</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="box-border flex flex-col gap-[20px] md:gap-[25px] h-[500px] md:h-[650px] items-end justify-end p-[25px] md:p-[35px] relative shrink-0 w-full">
          <Image 
            alt="Weather background" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgFrame5} 
            fill
            priority
          />
          
          {/* Weather Card */}
          <div className="bg-[#fffcf6] border-2 border-[#2e8623] border-solid relative rounded-[14.09px] shrink-0 w-full max-w-[400px] z-10">
            <div className="box-border flex flex-col gap-[20px] md:gap-[30px] items-center overflow-clip pb-[28px] md:pb-[35px] pt-[18px] md:pt-[23px] px-[18px] md:px-[23px] relative rounded-[inherit]">
              {loading ? (
                <div className="py-8 text-center text-[#2e8623] font-['Be_Vietnam_Pro']">
                  Đang tải...
                </div>
              ) : !weather ? (
                <div className="py-8 text-center text-gray-500 font-['Be_Vietnam_Pro']">
                  Chọn ruộng để xem thời tiết
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-[14px] md:gap-[18px] items-start relative shrink-0 w-full">
                    {/* Date Selector */}
                    <div className="flex gap-[6px] items-center justify-center relative shrink-0 w-full">
                      <button 
                        onClick={handlePrevDay}
                        disabled={selectedDayIndex === 0}
                        className="flex items-center justify-center relative shrink-0 hover:opacity-70 transition-opacity disabled:opacity-30"
                      >
                        <ChevronLeft className="h-[20px] md:h-[22px] w-[12px] md:w-[13px] text-[#2e8623]" />
                      </button>
                      
                      {currentDay && (
                        <div className="flex flex-[1_0_0] flex-col font-['Be_Vietnam_Pro'] font-semibold items-start leading-[normal] min-h-px min-w-px relative shrink-0 text-black text-center">
                          <p className="relative shrink-0 text-[40px] md:text-[48px] w-full">
                            {formatDate(currentDay.date).day}
                          </p>
                          <p className="relative shrink-0 text-[17px] md:text-[20px] w-full">
                            Tháng {formatDate(currentDay.date).month}
                          </p>
                        </div>
                      )}
                      
                      <button 
                        onClick={handleNextDay}
                        disabled={!weather || selectedDayIndex >= weather.forecast_days.length - 1}
                        className="h-[20px] md:h-[22px] relative shrink-0 w-[12px] md:w-[13px] hover:opacity-70 transition-opacity disabled:opacity-30"
                      >
                        <ChevronRight className="h-[20px] md:h-[22px] w-[12px] md:w-[13px] text-[#2e8623]" />
                      </button>
                    </div>
                    
                    {/* Weather Info */}
                    {currentDay && (
                      <div className="flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-black w-full">
                        <p className="font-['Be_Vietnam_Pro'] font-semibold relative shrink-0 text-[20px] md:text-[24px] w-full">
                          {Math.round(currentDay.avg_temp)}° - {currentDay.conditions}
                        </p>
                        
                        {/* Weather Details */}
                        <div className="flex flex-col gap-[8px] w-full text-[13px] md:text-[15px] font-['Be_Vietnam_Pro']">
                          <div className="flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-[#2e8623]" />
                            <span>Mưa: {currentDay.total_rainfall} mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-[#2e8623]" />
                            <span>Độ ẩm: {Math.round(currentDay.avg_humidity)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#2e8623]">🌡️</span>
                            <span>
                              {Math.round(currentDay.min_temp)}° - {Math.round(currentDay.max_temp)}°
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weather Alerts */}
                  {weather.alerts && weather.alerts.length > 0 && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="font-['Be_Vietnam_Pro'] font-semibold text-red-700 text-sm mb-1">
                        ⚠️ Cảnh báo thời tiết
                      </p>
                      {weather.alerts.map((alert, idx) => (
                        <p key={idx} className="font-['Be_Vietnam_Pro'] text-red-600 text-xs">
                          {alert.headline}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
