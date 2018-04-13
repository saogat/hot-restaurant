// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Reservation
// =============================================================
var reservations = [];
var waitlisted = [];

// Routes
// =============================================================
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/add", function (req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});

app.get("/view", function (req, res) {
  res.sendFile(path.join(__dirname, "view.html"));
});

app.get("/api/reservations", function (req, res) {
  return res.json(reservations);
});

app.get("/api/reservations/:reservation", function (req, res) {
  var chosen = req.params.reservation;

  console.log(chosen);

  for (var i = 0; i < reservations.length; i++) {
    if (chosen === reservations[i].routeName) {
      return res.json(reservations[i]);
    }
  }

  return res.json(false);

});

app.post("/api/reservations", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var newreservation = req.body;
  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newreservation.routeName = newreservation.name.replace(/\s+/g, "").toLowerCase();

  console.log(newreservation);

  if (reservations.length < 5) {
    reservations.push(newreservation);
    console.log(newreservation.phone);
    sendMessage(newreservation.phone);
    res.json(true);
  } else {
    waitlisted.push(newreservation);
    res.json(false)
  }

});

function sendMessage(number) {
  // Twilio Credentials
  const accountSid = 'AC625d90ff81c3f51cf5cf4c801d6be0b0';
  const authToken = 'f483c3d3e343f5ee17ad227cb954e973';
  // require the Twilio module and create a REST client
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      to: '+1' + number,
      from: '+18448942696',
      body: "Your reservation is confirmed!"
    })
    .then((message) => console.log(message.sid))
    .catch( err => console.log( err ) );
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});