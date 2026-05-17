// Local storage helper functions for data persistence

export const storage = {
  // User data
  getUser: (): any => {
    const user = localStorage.getItem('medic:user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem('medic:user', JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem('medic:user');
  },

  // Health records
  getHealthRecords: (userId: string): any[] => {
    const records = localStorage.getItem(`medic:health-records:${userId}`);
    return records ? JSON.parse(records) : [];
  },
  setHealthRecords: (userId: string, records: any[]) => {
    localStorage.setItem(`medic:health-records:${userId}`, JSON.stringify(records));
  },

  // Appointments
  getAppointments: (userId: string): any[] => {
    const appointments = localStorage.getItem(`medic:appointments:${userId}`);
    return appointments ? JSON.parse(appointments) : [];
  },
  setAppointments: (userId: string, appointments: any[]) => {
    localStorage.setItem(`medic:appointments:${userId}`, JSON.stringify(appointments));
  },

  // All appointments (for admin)
  getAllAppointments: (): any[] => {
    const appointments = localStorage.getItem('medic:all-appointments');
    return appointments ? JSON.parse(appointments) : [];
  },
  setAllAppointments: (appointments: any[]) => {
    localStorage.setItem('medic:all-appointments', JSON.stringify(appointments));
  },

  // Lab bookings
  getLabBookings: (userId: string): any[] => {
    const bookings = localStorage.getItem(`medic:lab-bookings:${userId}`);
    return bookings ? JSON.parse(bookings) : [];
  },
  setLabBookings: (userId: string, bookings: any[]) => {
    localStorage.setItem(`medic:lab-bookings:${userId}`, JSON.stringify(bookings));
  },

  // All lab bookings (for admin)
  getAllLabBookings: (): any[] => {
    const bookings = localStorage.getItem('medic:all-lab-bookings');
    return bookings ? JSON.parse(bookings) : [];
  },
  setAllLabBookings: (bookings: any[]) => {
    localStorage.setItem('medic:all-lab-bookings', JSON.stringify(bookings));
  },

  // Orders
  getOrders: (userId: string): any[] => {
    const orders = localStorage.getItem(`medic:orders:${userId}`);
    return orders ? JSON.parse(orders) : [];
  },
  setOrders: (userId: string, orders: any[]) => {
    localStorage.setItem(`medic:orders:${userId}`, JSON.stringify(orders));
  },

  // Cart
  getCart: (userId: string): any[] => {
    const cart = localStorage.getItem(`medic:cart:${userId}`);
    return cart ? JSON.parse(cart) : [];
  },
  setCart: (userId: string, cart: any[]) => {
    localStorage.setItem(`medic:cart:${userId}`, JSON.stringify(cart));
  },

  // Emergency requests
  getEmergencyRequests: (userId: string): any[] => {
    const requests = localStorage.getItem(`medic:emergency:${userId}`);
    return requests ? JSON.parse(requests) : [];
  },
  setEmergencyRequests: (userId: string, requests: any[]) => {
    localStorage.setItem(`medic:emergency:${userId}`, JSON.stringify(requests));
  },

  // All users (for admin)
  getAllUsers: (): any[] => {
    const users = localStorage.getItem('medic:all-users');
    return users ? JSON.parse(users) : [];
  },
  setAllUsers: (users: any[]) => {
    localStorage.setItem('medic:all-users', JSON.stringify(users));
  },
};
