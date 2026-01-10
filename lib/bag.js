// Bag/Cart utility functions using localStorage
// This will be replaced with backend API later

const BAG_STORAGE_KEY = 'journi_bag';

export const bagAPI = {
  // Get all items from bag
  getAll: () => {
    if (typeof window === 'undefined') return [];
    try {
      const bagData = localStorage.getItem(BAG_STORAGE_KEY);
      return bagData ? JSON.parse(bagData) : [];
    } catch (error) {
      console.error('Error reading bag:', error);
      return [];
    }
  },

  // Add item to bag
  add: (item) => {
    if (typeof window === 'undefined') return null;
    try {
      const bagItems = bagAPI.getAll();
      // Check if item already exists (same slot)
      const existingIndex = bagItems.findIndex(
        (i) => i.slotId === item.slotId && i.experienceId === item.experienceId
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        bagItems[existingIndex] = item;
      } else {
        // Add new item with unique ID
        item.id = `${item.experienceId}-${item.slotId}-${Date.now()}`;
        bagItems.push(item);
      }
      
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
      // Dispatch custom event for bag updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bagUpdated'));
      }
      return item;
    } catch (error) {
      console.error('Error adding to bag:', error);
      return null;
    }
  },

  // Remove item from bag
  remove: (itemId) => {
    if (typeof window === 'undefined') return false;
    try {
      const bagItems = bagAPI.getAll();
      const filteredItems = bagItems.filter((item) => item.id !== itemId);
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(filteredItems));
      // Dispatch custom event for bag updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bagUpdated'));
      }
      return true;
    } catch (error) {
      console.error('Error removing from bag:', error);
      return false;
    }
  },

  // Clear all items from bag
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(BAG_STORAGE_KEY);
      // Dispatch custom event for bag updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bagUpdated'));
      }
    } catch (error) {
      console.error('Error clearing bag:', error);
    }
  },

  // Get bag count
  getCount: () => {
    return bagAPI.getAll().length;
  },

  // Calculate subtotal
  getSubtotal: () => {
    const bagItems = bagAPI.getAll();
    return bagItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  },
};

