// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const charCount = document.getElementById('charCount');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial time for welcome message
    setCurrentTime('welcomeTime');
    
    // Auto-resize textarea
    messageInput.addEventListener('input', autoResizeTextarea);
    
    // Character count
    messageInput.addEventListener('input', updateCharCount);
    
    // Send message on Enter (but not Shift+Enter)
    messageInput.addEventListener('keydown', handleKeyDown);
    
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Focus input on load
    messageInput.focus();
});

// Auto-resize textarea based on content
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Update character count
function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/4000`;
    
    // Change color when approaching limit
    if (count > 3500) {
        charCount.style.color = '#dc3545';
    } else if (count > 3000) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#6c757d';
    }
}

// Handle keyboard input
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Disable input and button
    setLoadingState(true);
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    autoResizeTextarea();
    updateCharCount();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send request to backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        if (response.ok) {
            // Add bot response
            addMessage(data.response, 'bot');
        } else {
            // Show error message
            addMessage(`Error: ${data.error || 'Something went wrong'}`, 'bot', true);
        }
        
    } catch (error) {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Show error message
        addMessage(`Network error: ${error.message}`, 'bot', true);
    } finally {
        // Re-enable input and button
        setLoadingState(false);
        messageInput.focus();
    }
}

// Add message to chat
function addMessage(text, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message message-sent`;
    
    if (isError) {
        messageDiv.classList.add('error-message');
    }
    
    const avatar = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="${avatar}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Format message text (handle line breaks, links, etc.)
function formatMessage(text) {
    // Escape HTML
    text = text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert code blocks (```code```)
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code (`code`)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Set loading state
function setLoadingState(loading) {
    messageInput.disabled = loading;
    sendButton.disabled = loading;
    
    if (loading) {
        sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        messageInput.classList.add('loading');
    } else {
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        messageInput.classList.remove('loading');
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Set current time for welcome message
function setCurrentTime(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = getCurrentTime();
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    scrollToBottom();
});

// Handle page visibility change (refocus input when tab becomes active)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        messageInput.focus();
    }
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus input
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        messageInput.focus();
    }
    
    // Escape to clear input
    if (event.key === 'Escape' && messageInput === document.activeElement) {
        messageInput.value = '';
        autoResizeTextarea();
        updateCharCount();
    }
});

// Add click to focus input
chatMessages.addEventListener('click', function() {
    messageInput.focus();
});

// Prevent form submission on Enter in textarea
messageInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.shiftKey) {
        // Allow Shift+Enter for new lines
        return;
    }
});

// Add smooth scrolling behavior
chatMessages.style.scrollBehavior = 'smooth';

// Add message animation delay for multiple messages
let messageDelay = 0;
function addMessageWithDelay(text, sender, isError = false) {
    setTimeout(() => {
        addMessage(text, sender, isError);
    }, messageDelay);
    messageDelay += 100; // 100ms delay between messages
}

// Reset message delay
function resetMessageDelay() {
    messageDelay = 0;
}
