// Chat Application JavaScript
class ChatApp {
    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.error = null;
        this.language = 'en'; // Default language, can be 'en' or 'de'
        
        // API Configuration
        this.baseUrl = 'https://c0168adb8baa.ngrok-free.app';
        this.chatEndpoint = '/api/chat/public';
        
        // DOM Elements
        this.messagesContainer = document.getElementById('messages-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorBanner = document.getElementById('error-banner');
        this.errorMessage = document.getElementById('error-message');
        this.closeErrorButton = document.getElementById('close-error');
        this.languageSelect = document.getElementById('language-select');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Close error banner
        this.closeErrorButton.addEventListener('click', () => this.clearError());
        
        // Language selector change
        this.languageSelect.addEventListener('change', (e) => {
            this.language = e.target.value;
            console.log('Language changed to:', this.language);
            
            // Update welcome message if it's the first message
            if (this.messages.length === 1 && this.messages[0].type === 'assistant') {
                this.messagesContainer.innerHTML = '';
                this.messages = [];
                this.addWelcomeMessage();
            }
        });
        
        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message to UI
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show loading
        this.setLoading(true);
        this.clearError();
        
        try {
            const response = await this.sendToAPI(message);
            
            if (response.error) {
                this.showError(response.error);
                return;
            }
            
            // Add assistant response
            this.addMessage(response.message, 'assistant', response.quickReplyOptions);
            
        } catch (error) {
            this.showError('Connection error occurred. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async sendToAPI(message) {
        const url = `${this.baseUrl}${this.chatEndpoint}`;
        
        // Convert messages to chat history format
        const chatHistory = this.messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.message
        }));
        
        const requestBody = {
            message: message,
            chat_history: chatHistory,
            language: this.language
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Add authentication header if needed
                    // 'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || `Server error: ${response.status}`;
                return { error: errorMessage };
            }
            
            const data = await response.json();
            return {
                message: data.answer || '',
                quickReplyOptions: data.quick_reply_options || []
            };
        } catch (error) {
            console.error('API Error:', error);
            return { error: 'Connection error occurred. Please try again.' };
        }
    }
    
    addMessage(message, type, quickReplyOptions = []) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                ${this.escapeHtml(message)}
                <span class="message-time">${timestamp}</span>
                ${quickReplyOptions.length > 0 ? this.createQuickReplies(quickReplyOptions) : ''}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add click handlers for quick reply buttons
        if (quickReplyOptions.length > 0) {
            const quickReplyButtons = messageElement.querySelectorAll('.quick-reply-btn');
            quickReplyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.messageInput.value = button.textContent;
                    this.sendMessage();
                });
            });
        }
    }
    
    createQuickReplies(options) {
        const quickRepliesHtml = options.map(option => 
            `<button class="quick-reply-btn">${this.escapeHtml(option)}</button>`
        ).join('');
        
        return `<div class="quick-replies">${quickRepliesHtml}</div>`;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        
        if (loading) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }
    
    showError(message) {
        this.error = message;
        this.errorMessage.textContent = message;
        this.errorBanner.classList.remove('hidden');
    }
    
    clearError() {
        this.error = null;
        this.errorBanner.classList.add('hidden');
    }
    
    clearChatHistory() {
        this.messages = [];
        this.messagesContainer.innerHTML = '';
        this.addWelcomeMessage();
    }
    
    addWelcomeMessage() {
        const welcomeMessages = {
            en: {
                message: 'Hello! I\'m your 24/7 care assistant. I\'m here to help you with medication reminders, care plan questions, emergency situations, and general health inquiries. How can I assist you today?',
                quickReplies: ['I want to apply for care money', 'How can I make an appointment?', 'How can I take care of my relative?']
            },
            de: {
                message: 'Hallo! Ich bin Ihr 24/7 Pflegeassistent. Ich bin hier, um Ihnen bei Medikamentenerinnerungen, Fragen zum Pflegeplan, Notfallsituationen und allgemeinen Gesundheitsfragen zu helfen. Wie kann ich Ihnen heute helfen?',
                quickReplies: ['Ich möchte für meine Pflegegelder beantragen', 'Wie kann ich einen Termin vereinbaren?', 'Wie kann ich meinen Angehörigen pflegen?']
            }
        };
        
        const currentLang = welcomeMessages[this.language] || welcomeMessages.en;
        this.addMessage(currentLang.message, 'assistant', currentLang.quickReplies);
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Mock API for demo purposes (remove this when connecting to real API)
class MockChatAPI {
    static async sendMessage(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock responses based on user input
        const responses = {
            'hello': {
                message: 'Hello! I\'m your 24/7 care assistant. How can I help you today?',
                quickReplyOptions: ['I need help with medication', 'I have a question about my care plan', 'I\'m feeling unwell']
            },
            'help': {
                message: 'I\'m here to help! I can assist you with medication reminders, care plan questions, emergency situations, and general health inquiries. What do you need help with?',
                quickReplyOptions: ['Medication reminder', 'Emergency help', 'Care plan questions']
            },
            'medication': {
                message: 'I can help you with medication management. Would you like me to set up a reminder, check your medication schedule, or answer questions about your prescriptions?',
                quickReplyOptions: ['Set up reminder', 'Check schedule', 'Medication questions']
            },
            'emergency': {
                message: 'If you\'re experiencing a medical emergency, please call emergency services immediately at 911. I can also help you contact your healthcare provider or family members.',
                quickReplyOptions: ['Call 911', 'Contact provider', 'Contact family']
            }
        };
        
        const lowerMessage = message.toLowerCase();
        let response = {
            message: 'Thank you for your message. I\'m here to help with your care needs. How can I assist you today?',
            quickReplyOptions: ['Medication help', 'Emergency assistance', 'Care questions']
        };
        
        // Find matching response
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                response = value;
                break;
            }
        }
        
        return response;
    }
}

// Initialize the chat application
document.addEventListener('DOMContentLoaded', () => {
    const chatApp = new ChatApp();
    
    // For demo purposes, you can replace the sendToAPI method with mock API
    // Uncomment the following lines to use mock API instead of real API:
    /*
    chatApp.sendToAPI = async function(message) {
        try {
            const response = await MockChatAPI.sendMessage(message);
            return response;
        } catch (error) {
            return { error: 'Failed to get response' };
        }
    };
    */
    
    // Add welcome message
    setTimeout(() => {
        chatApp.addWelcomeMessage();
    }, 500);
}); 