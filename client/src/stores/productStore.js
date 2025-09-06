import { create } from "zustand";
import { persist } from "zustand/middleware";

const mockProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: 7055,
    category: "Clothing",
    description:
      "A beautiful vintage leather jacket in excellent condition. Perfect for casual outings.",
    image:
      "https://via.placeholder.com/300x300/4ade80/ffffff?text=Leather+Jacket",
    userId: 1,
    latitude: 28.6139, // New Delhi
    longitude: 77.2090,
    location: "New Delhi, India",
  },
  {
    id: 2,
    title: "MacBook Pro 2019",
    price: 99600,
    category: "Electronics",
    description:
      "MacBook Pro 13-inch from 2019, great for work and creative projects. Minor wear on corners.",
    image: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=MacBook+Pro",
    userId: 2,
    latitude: 19.0760, // Mumbai
    longitude: 72.8777,
    location: "Mumbai, India",
  },
  {
    id: 3,
    title: "Wooden Coffee Table",
    price: 12450,
    category: "Furniture",
    description:
      "Handcrafted wooden coffee table with unique grain patterns. Perfect for modern homes.",
    image:
      "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Coffee+Table",
    userId: 1,
    latitude: 12.9716, // Bangalore
    longitude: 77.5946,
    location: "Bangalore, India",
  },
  {
    id: 4,
    title: "Canon DSLR Camera",
    price: 37350,
    category: "Electronics",
    description:
      "Canon EOS Rebel T7i with kit lens. Great for photography enthusiasts.",
    image:
      "https://via.placeholder.com/300x300/ef4444/ffffff?text=Canon+Camera",
    userId: 3,
    latitude: 22.5726, // Kolkata
    longitude: 88.3639,
    location: "Kolkata, India",
  },
  {
    id: 5,
    title: "Designer Handbag",
    price: 16600,
    category: "Clothing",
    description:
      "Authentic designer handbag in mint condition. Comes with original packaging.",
    image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Handbag",
    userId: 2,
    latitude: 13.0827, // Chennai
    longitude: 80.2707,
    location: "Chennai, India",
  },
];

const useProductStore = create(
  persist(
    (set, get) => ({
      products: mockProducts,
      searchQuery: "",
      selectedCategory: "All",

      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: Date.now(),
              image: `https://via.placeholder.com/300x300/4ade80/ffffff?text=${encodeURIComponent(
                product.title
              )}`,
            },
          ],
        })),

      editProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      getFilteredProducts: () => {
        const { products, searchQuery, selectedCategory } = get();
        let filtered = products;

        if (selectedCategory && selectedCategory !== "All") {
          filtered = filtered.filter(
            (product) => product.category === selectedCategory
          );
        }

        if (searchQuery) {
          filtered = filtered.filter(
            (product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
        }

        return filtered;
      },

      getUserProducts: (userId) => {
        const { products } = get();
        return products.filter((product) => product.userId === userId);
      },

      getProductById: (id) => {
        const { products } = get();
        return products.find((product) => product.id === parseInt(id));
      },

      getCategories: () => {
        const { products } = get();
        const categories = [
          "All",
          ...new Set(products.map((product) => product.category)),
        ];
        return categories;
      },
    }),
    {
      name: "product-storage",
      partialize: (state) => ({
        products: state.products,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);

export default useProductStore;
