# notekeeper
Express app used for storing private notes online, accessible via Google OAuth2.0 Strategy for Passport.
Format notes with Rich Text Editor features such as headings and paragraphs. 
Create checklists within notes, and store their checked status.

To run locally a `keys.js` file like the one below must be added in the `/config` folder
```
module.exports = {
  google: {
    clientID: "yourClientId",
    clientSecret: "yourClientSecret"
  },
  mongodb: {
    dbURI: "mongodb://localhost:3000/notekeep-db"
  },
  session: {
    cookieKey: "aRandomString"
  }
};
```

## Heroku
App is deployed on a free Heroku account at http://young-bayou-27755.herokuapp.com

## Screenshot

![ezgif com-optimize](https://user-images.githubusercontent.com/33398703/37832479-04f4d1c8-2ea9-11e8-8ea0-43ff5d726d54.gif)
