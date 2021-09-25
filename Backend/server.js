var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

// static path for photos
app.use('/uploads/', express.static(__dirname + '/uploads/'));


// Mongodb URI

const mongoURI = 'mongodb://localhost:27017/hitech?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

// Connection
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Database has been connected successfully.'))
  .catch(err => console.log(err))

// Main routes  

// Department
var Departments = require('./routes/DepartmentRoute')
app.use('/department', Departments)

// Employee
var Employees = require('./routes/EmployeeRoute');
app.use('/employee', Employees);

// Category
var Categories = require('./routes/CategoryRoute');
app.use('/category', Categories);

// Product
var Products = require('./routes/ProductRoute');
app.use('/product', Products);

// User
var Customers = require('./routes/CustomerRoute');
app.use('/customer', Customers);

// OrderMaster
var Orders = require('./routes/OrderRoute');
app.use('/order', Orders);

// User
var Users = require('./routes/UserRoute');
app.use('/user', Users);

// Gallery
var GalleryImages = require('./routes/GalleryRoute');
app.use('/gallery', GalleryImages);

// Listening server port
app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})