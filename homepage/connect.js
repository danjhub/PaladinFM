document.addEventListener('DOMContentLoaded', (event) => {
    const sendButton = document.querySelector('.send-button');
    const chatInputField = document.querySelector('.chat-input-field');
    const chatMessages = document.querySelector('.chat-messages');

    sendButton.addEventListener('click', () => {
        const messageText = chatInputField.value.trim();
        if (messageText !== '') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            const userImage = document.createElement('img');
            userImage.src = 'user1.jpg'; // Replace with the actual user's image
            userImage.alt = 'User 1';
            userImage.classList.add('user-image');

            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');

            const messageParagraph = document.createElement('p');
            messageParagraph.textContent = messageText;

            messageContent.appendChild(messageParagraph);
            messageElement.appendChild(userImage);
            messageElement.appendChild(messageContent);
            chatMessages.appendChild(messageElement);

            chatInputField.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    chatInputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});