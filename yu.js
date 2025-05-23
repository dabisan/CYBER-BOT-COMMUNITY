const login = require('facebook-chat-api');


const appState = JSON.parse(process.env.APPSTATE);

login({appState}, (err, api) => {
  if (err) return console.error(err);
  
  console.log("Logged in successfully!");
});
