import { bookingApi } from './api';

export const bookingService = {
  async createBooking(bookingData) {
    try {
      const response = await bookingApi.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Booking API Error:', error.response.status, JSON.stringify(error.response.data));
      } else {
        console.error('Booking API Unknown Error:', error.message);
      }
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  async getBookingById(id) {
    try {
      const response = await bookingApi.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  async getUserBookings(userId) {
    try {
      const response = await bookingApi.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  },

  async updateBooking(id, updateData) {
    try {
      const response = await bookingApi.put(`/bookings/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },

  async cancelBooking(id) {
    try {
      const response = await bookingApi.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
};

export default bookingService; 