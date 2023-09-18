// // const express = require("express");
// // const app = express();
// // const morgan = require("morgan");


// // app.use(morgan("common"));

// // const verifyPW = (req, res, next) => {
// //     const {password} = req.query;
// //     if (password === "chickennugget") {
// //         next();
// //     }
// //     res.send("Sorry you need a correct passowrd")
// // }





// // app.get("/", (req, res) => {
// //     res.send("Home Page")
// // })

// // app.get("/dogs", (req, res) => {
// //     res.send("Woof Woof!")
// // })

// // app.get("/secret", verifyPW, (req, res) => {
// //     res.send("My Secret!")
// // })

// // app.use((req, res) => {
// //     res.status(404).send("NOT FOUND");
// // })

// // app.listen(8000, () => console.log("Running on Port 8000..."));




// async function getImageURL() {
//     return fetch("https://api.unsplash.com/photos/random/?client_id=m62qKMmhIeT7dZOvOXxWQtDDDUS-rmVe-W86ASxGitk&collections=3401761", { method: "GET" })
//             .then(res => res.json())
//             .then(res => {
//                 let data = res;
//                 return data;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
// }

// getImageURL().then(data => console.log(data))

// // // https://api.unsplash.com/photos/random/?client_id=m62qKMmhIeT7dZOvOXxWQtDDDUS-rmVe-W86ASxGitk&collections=3401761



// // const Building = require("./models/review");

// // async function test() {
// //     const building = await Building.findOne({"_id": "64ffa6b2c147de96165e93a4"})
// //     console.log(building);
// // }

// // test();

//  //64ffa6b2c147de96165e93a4