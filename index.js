const bodyParser = require("body-parser");
const express = require("express");
const request = require("postman-request");
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/", function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/0b90d1cf4c";

  const options = {
    method: "POST",
    auth: "Lovecrafts_Cat:55ed2a8ee2f08062aeb25583d99117a51-us5"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname+ "/success.html");
    }else {
      res.sendFile(__dirname+ "/failure.html")
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));

    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.listen(process.env.PORT || 3000)
