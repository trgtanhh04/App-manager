const API_BASE_URL = "http://localhost:8000/api";

export const apiService = {
    // extract data from file
    async uploadFile(file, sessionId) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', sessionId);

            const response = await fetch(`${API_BASE_URL}/chat/upload`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },
    // ask question to chatbot
    async askQuestion(question, sessionId) {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    question: question, 
                    session_id: sessionId 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error asking question:", error);
            throw error;
        }
    },
}