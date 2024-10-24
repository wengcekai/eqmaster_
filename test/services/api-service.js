const API_ENDPOINT = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net';
// const API_ENDPOINT = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/';

export default {
	baseURL: API_ENDPOINT, // 将 baseURL 添加到导出的对象中

	async getHomepageData(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_homepage/${userId}`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				console.error('Failed to fetch homepage data:', response.statusCode);
				// Return mock data in case of failure
				return {
					"response": {
						"personal_info": {
							"name": "John Doe",
							"tag": "Engineer",
							"tag_description": "A detail-oriented engineer with a passion for problem-solving.",
							"job_id": "12345"
						},
						"eq_scores": {
							"score": 46,
							"dimension1_score": 54,
							"dimension1_detail": "Shows excellent emotional regulation in stressful situations.",
							"dimension2_score": 26,
							"dimension2_detail": "Displays strong empathy towards others' feelings.",
							"dimension3_score": 42,
							"dimension3_detail": "Able to make decisions without letting emotions interfere.",
							"dimension4_score": 50,
							"dimension4_detail": "Communicates emotions clearly and effectively.",
							"dimension5_score": 44,
							"dimension5_detail": "Manages interpersonal relationships with ease.",
							"summary": "Overall, emotionally intelligent and adaptive.",
							"detail": "John demonstrates balanced emotional intelligence across all areas.",
							"overall_suggestion": "Continue to enhance emotional regulation and interpersonal communication.",
							"detail_summary": "A well-rounded emotional intelligence profile with strong interpersonal skills."
						},
					}
				};
			}
		} catch (error) {
			console.error('Error fetching homepage data:', error);
			throw error;
		}
	},

	async getAnalysisList(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/${userId}/analysisList`,
				method: 'GET',
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get analysis list: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting analysis list:', error);
			throw error;
		}
	},

	async uploadChatHistory(filePath, userId) {
		try {
			const response = await uni.uploadFile({
				url: `${API_ENDPOINT}/analyze/history`,
				filePath: filePath,
				name: 'file',
				formData: {
					user_id: userId
				}
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`upload chat history failed: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('upload chat history failed', error);
			throw error;
		}
	},

	async deleteMoment(chatId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/delete_chats/${chatId}`,
				method: 'DELETE',
			});

			if (response.statusCode === 200) {
				return response;
			} else {
				throw new Error(`Failed to create contact profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error creating contact profile:', error);
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

	async getResult(jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_result/${jobId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get result: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting result:', error);
			throw error;
		}
	},

	async getBattlefield(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_battlefield/${userId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get result: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting result:', error);
			throw error;
		}
	},

	async getContactProfile(contactId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_contact_profile/${contactId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				console.error('Failed to fetch contact profile:', response.statusCode);
				throw new Error(`Failed to fetch contact profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error fetching contact profile:', error);
			throw error;
		}
	},

	async uploadImage(filePath) {
		try {
			const uploadFileRes = await uni.uploadFile({
				url: `${API_ENDPOINT}/upload_image`,
				filePath: filePath,
				name: 'file'
			});

			if (uploadFileRes.statusCode === 200) {
				return JSON.parse(uploadFileRes.data);
			} else {
				throw new Error(`Upload failed: ${uploadFileRes.statusCode}`);
			}
		} catch (error) {
			console.error('Upload failed', error);
			throw error;
		}
	},

	async createProfile(profileData) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/create_profile`,
				method: 'POST',
				data: profileData
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to create profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error creating profile:', error);
			throw error;
		}
	},

	async startScenario(jobId) {
		console.log('startScenario called with jobId:', jobId);
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/start_scenario/${jobId}?locale=en`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				console.error('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to start scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error starting scenario:', error);
			throw error;
		}
	},

	async startScenarioWithId(jobId, scenarioId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/start_scenario_by_scenario_id/${jobId}/${scenarioId}`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				console.error('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to start scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error starting scenario:', error);
			throw error;
		}
	},

	async getCurrentScenario(jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_current_scenario/${jobId}?locale=en`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get current scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting current scenario:', error);
			throw error;
		}
	},

	async chooseScenario(choice, jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/choose_scenario?locale=en`,
				method: 'POST',
				data: {
					choice: choice,
					job_id: jobId
				}
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to choose scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error choosing scenario:', error);
			throw error;
		}
	},

	// Add more API methods here as needed
};