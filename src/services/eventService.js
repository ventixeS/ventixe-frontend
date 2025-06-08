import { eventApi } from './api';

export const eventService = {
  async getAllEvents() {
    try {
      const response = await eventApi.get('/events');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  async getEventById(id) {
    try {
      const response = await eventApi.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  },

  async createEvent(eventData) {
    try {
      const response = await eventApi.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async updateEvent(id, updateData) {
    try {
      const response = await eventApi.put(`/events/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  async deleteEvent(id) {
    try {
      const response = await eventApi.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  }
};

export default eventService; 