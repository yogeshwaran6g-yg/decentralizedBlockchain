import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const slotApiService = {
    /**
     * Fetch slot activation/levels for a user
     * @param {string|number} userId 
     * @returns {Promise<Object>}
     */
    async fetchSlotActivation(userId) {
        try {
            // Assuming the endpoint exists or will be added
            const data = await api.get(`${API_ENDPOINTS.PROFILE.GET_BY_USER(userId)}/levels`);
            return data;
        } catch (error) {
            return handleServiceError(error, 'SlotApiService.fetchSlotActivation');
        }
    },

    /**
     * Update slot activation/levels
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async updateSlotActivation(data) {
        try {
            const response = await api.put(`${API_ENDPOINTS.PROFILE.UPDATE}/levels`, data, {
                showSuccessToast: true
            });
            return response;
        } catch (error) {
            return handleServiceError(error, 'SlotApiService.updateSlotActivation');
        }
    }
};
