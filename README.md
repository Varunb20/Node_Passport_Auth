# Node_Passport_Auth
A user registration and authentication web-app.

**Technologies used:** NodeJs, Express, Passport, Mongoose, EJS.

# User Guide

First, create a new folder named `keys.js` in `config` and add your MongoDB URI to it.

Use the following syntax -
```
myURI = 'mongodb+srv://` + {Your Username} + ':' + {Your Password} + '@' + {Cluster Name} + '.mongodb.net/?retryWrites=true&w=majority'
module.exports = {
    MongoURI : myURI
};
```

Be sure that you are using hex code in place of any special symbol in your username and/or password.

Now, run the following commands in the terminal -

1. `npm install`
2. `npm start` or `npm run dev` (To run the project with Nodemon)

Visit `localhost::5000` to use the web-app.
