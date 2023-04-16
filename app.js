const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { log } = require("console");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("static"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/7c4a207a3f";
    const options = {
        method: "POST",
        auth: "mosha:b532d934fff1b05682170722a658fbf7-us14"
    };
    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT,(req, res) => {
    console.log("Server is running at Port 3000")
});

// mailChimpAPI Key
// b532d934fff1b05682170722a658fbf7-us14

// audience ID
// 7c4a207a3f