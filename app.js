
const express = require("express");
const Cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const route = require('./routes')
const db  = require('./db/models')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(Cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// db.sequelize.sync();
 app.use(route)
  

app.all('*', (req, res) => {
  return res.json({ message: '#NOT_FOUND 😒😒😒' })
})

const PORT = process.env.PORT || '3000'

app.listen(PORT,()=>{
    console.log(`App is listening on PORT  ${PORT}`)
})

