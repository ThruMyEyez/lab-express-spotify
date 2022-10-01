require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebAPI = require("spotify-web-api-node");

const app = express(),
  port = 3000;

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebAPI({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch(error => console.log("Something went wrong when retrieving an access token", error));
// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const searchTerm = req.query.term;
  spotifyApi
    .searchArtists(searchTerm)
    .then(data => {
      //http://127.0.0.1:3000/artist-search?term=eminem
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      const artistData = data.body.artists.items;
      console.log(artistData[0].images);

      res.render("artistSearchResults", { artistData: artistData });
    })
    .catch(err => console.log("The error while searching artists occurred: ", err));
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here
});

app.listen(port, () => console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`));
//const clientId = process.env.CLIENT_ID;
//const clientSecret = process.env.CLIENT_SECRET;
//
//console.log(spotifyApi);
