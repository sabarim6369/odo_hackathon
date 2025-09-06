import { create } from "zustand";
import { persist } from "zustand/middleware";

const mockPurchases = [
  {
    id: 1,
    productId: 1,
    title: "Vintage Leather Jacket",
    price: 7055,
    purchaseDate: "2024-12-15",
    status: "Delivered",
    transactionId: "TXN001",
  },
  {
    id: 2,
    productId: 4,
    title: "Canon DSLR Camera",
    price: 37350,
    purchaseDate: "2024-12-10",
    status: "Delivered",
    transactionId: "TXN002",
  },
];

const mockTransactions = [
  {
    id: "TXN001",
    productName: "Vintage Leather Jacket",
    amount: 7055,
    status: "Completed",
    date: "2024-12-15",
    type: "Purchase",
  },
  {
    id: "TXN002",
    productName: "Canon DSLR Camera",
    amount: 37350,
    status: "Completed",
    date: "2024-12-10",
    type: "Purchase",
  },
  {
    id: "TXN003",
    productName: "Designer Handbag",
    amount: 16600,
    status: "Completed",
    date: "2024-12-08",
    type: "Sale",
  },
];

const usePurchaseStore = create(
  persist(
    (set, get) => ({
      purchases: mockPurchases,
      transactions: mockTransactions,

      addPurchase: (cartItems) =>
        set((state) => {
          const newPurchases = cartItems.map((item) => ({
            id: Date.now() + Math.random(),
            productId: item.id,
            title: item.title,
            price: item.price * item.quantity,
            purchaseDate: new Date().toISOString().split("T")[0],
            status: "Processing",
            transactionId: `TXN${Date.now()}`,
          }));

          const newTransactions = cartItems.map((item) => ({
            id: `TXN${Date.now() + Math.random()}`,
            productName: item.title,
            amount: item.price * item.quantity,
            status: "Completed",
            date: new Date().toISOString().split("T")[0],
            type: "Purchase",
          }));

          return {
            purchases: [...state.purchases, ...newPurchases],
            transactions: [...state.transactions, ...newTransactions],
          };
        }),

      getPurchases: () => get().purchases,
      getTransactions: () => get().transactions,
    }),
    {
      name: "purchase-storage",
      partialize: (state) => ({
        purchases: state.purchases,
        transactions: state.transactions,
      }),
    }
  )
);

export default usePurchaseStore;
