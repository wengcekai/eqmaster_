const API_ENDPOINT = 'https://eqmaster.azurewebsites.net';

export default {
  async getHomepageData(jobId) {
    try {
      const response = await uni.request({
        url: `${API_ENDPOINT}/get_homepage/${jobId}`,
        method: 'POST'
      });
      
      if (response.statusCode === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to fetch homepage data: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      throw error;
    }
  },

  async createContactProfile(data) {
    try {
      const response = await uni.request({
        url: `${API_ENDPOINT}/create_contact_profile`,
        method: 'POST',
        data: data
      });
      
      if (response.statusCode === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to create contact profile: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Error creating contact profile:', error);
      throw error;
    }
  },

  // Add more API methods here as needed
};