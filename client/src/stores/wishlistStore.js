import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],

      addToWishlist: (product) =>
        set((state) => {
          const exists = state.wishlistItems.some(
            (item) => item.id === product.id
          );

          if (exists) {
            return state; // Don't add duplicates
          }

          return {
            wishlistItems: [...state.wishlistItems, product],
          };
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(
            (item) => item.id !== productId
          ),
        })),

      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ wishlistItems: [] }),

      getWishlistCount: () => {
        const { wishlistItems } = get();
        return wishlistItems.length;
      },

      toggleWishlist: (product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();

        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
          return false; // Removed from wishlist
        } else {
          addToWishlist(product);
          return true; // Added to wishlist
        }
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ wishlistItems: state.wishlistItems }),
    }
  )
);

export default useWishlistStore;
