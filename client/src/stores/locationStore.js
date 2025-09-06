import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLocationStore = create(
  persist(
    (set, get) => ({
      location: null,
      isLoading: false,
      error: null,
      permissionStatus: null,
      lastUpdated: null,

      // Get current location
      getCurrentLocation: async () => {
        set({ isLoading: true, error: null });

        try {
          // Check if geolocation is supported
          if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by this browser");
          }

          // Request location with high accuracy
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
              }
            );
          });

          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          // Get address from coordinates using reverse geocoding
          const address = await get().reverseGeocode(
            locationData.latitude,
            locationData.longitude
          );

          const fullLocation = {
            ...locationData,
            address,
            lastUpdated: new Date().toISOString(),
          };

          set({
            location: fullLocation,
            isLoading: false,
            error: null,
            permissionStatus: "granted",
          });

          return fullLocation;
        } catch (error) {
          let errorMessage = "Failed to get location";
          
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access denied by user";
              set({ permissionStatus: "denied" });
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "Location information unavailable";
              break;
            case 3: // TIMEOUT
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = error.message || "Unknown location error";
          }

          set({
            isLoading: false,
            error: errorMessage,
            permissionStatus: error.code === 1 ? "denied" : "prompt",
          });

          throw new Error(errorMessage);
        }
      },

      // Watch location changes
      watchLocation: () => {
        if (!navigator.geolocation) {
          set({ error: "Geolocation is not supported" });
          return null;
        }

        const watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            };

            const address = await get().reverseGeocode(
              locationData.latitude,
              locationData.longitude
            );

            set({
              location: {
                ...locationData,
                address,
                lastUpdated: new Date().toISOString(),
              },
            });
          },
          (error) => {
            console.error("Location watch error:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000,
          }
        );

        return watchId;
      },

      // Stop watching location
      stopWatching: (watchId) => {
        if (watchId && navigator.geolocation) {
          navigator.geolocation.clearWatch(watchId);
        }
      },

      // Reverse geocoding to get address from coordinates
      reverseGeocode: async (latitude, longitude) => {
        try {
          // Using a free geocoding service (you can replace with your preferred service)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error("Geocoding service unavailable");
          }

          const data = await response.json();
          
          return {
            city: data.city || data.locality || "Unknown City",
            state: data.principalSubdivision || "Unknown State",
            country: data.countryName || "Unknown Country",
            countryCode: data.countryCode || "",
            postalCode: data.postcode || "",
            formatted: `${data.city || data.locality || "Unknown"}, ${data.principalSubdivision || ""}, ${data.countryName || ""}`.replace(/, ,/g, ",").replace(/^,|,$/g, ""),
          };
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          return {
            city: "Unknown City",
            state: "Unknown State",
            country: "Unknown Country",
            countryCode: "",
            postalCode: "",
            formatted: "Location unavailable",
          };
        }
      },

      // Calculate distance between two points (in kilometers)
      calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      },

      // Get distance to a product/location
      getDistanceToLocation: (targetLat, targetLon) => {
        const { location } = get();
        if (!location) return null;
        
        return get().calculateDistance(
          location.latitude,
          location.longitude,
          targetLat,
          targetLon
        );
      },

      // Clear location data
      clearLocation: () => {
        set({
          location: null,
          error: null,
          permissionStatus: null,
          lastUpdated: null,
        });
      },

      // Check if location is stale (older than 30 minutes)
      isLocationStale: () => {
        const { location } = get();
        if (!location || !location.lastUpdated) return true;
        
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        return new Date(location.lastUpdated).getTime() < thirtyMinutesAgo;
      },

      // Refresh location if stale
      refreshLocationIfStale: async () => {
        if (get().isLocationStale()) {
          return await get().getCurrentLocation();
        }
        return get().location;
      },
    }),
    {
      name: "location-storage",
      partialize: (state) => ({
        location: state.location,
        permissionStatus: state.permissionStatus,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

export default useLocationStore;
