// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSTfFGXElJaxGkvWI41Tpg0MCRJyY6Vs4",
  authDomain: "churchapp-3e0d9.firebaseapp.com",
  projectId: "churchapp-3e0d9",
  storageBucket: "churchapp-3e0d9.appspot.com",
  messagingSenderId: "1020212812719",
  appId: "1:1020212812719:web:851f5142fd8b563efd6d5a",
  measurementId: "G-G8QV6V79PN",
  databaseURL: "https://churchapp-3e0d9-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the FCM messaging instance
const messaging = firebase.messaging();

// Handle form submission
const form = document.getElementById('notification-form');
form && form.addEventListener('submit', async (event) => {
  
  const title = document.getElementById('notification-title').value;
  const text = document.getElementById('notification-text').value;
  
  // Send notification to Node.js backend
  const response = await fetch('/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, text })
  });
  
  if (response.ok) {
    console.log('Notification sent successfully.');
  } else {
    console.error('Failed to send notification.');
  }
});