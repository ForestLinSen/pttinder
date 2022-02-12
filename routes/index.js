var express = require('express');
const db = require('../database');
const r = require('../resources');
var router = express.Router();

/* For password encryption */
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: r.APP_NAME, 
    page: 'Home',
  });
});

/* GET about us page. */
router.get('/about', function(req, res, next) {
  res.render('about_us', { 
    title: r.APP_NAME, 
    page: 'About', 
  });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  //console.log(req.body);
  res.render('register', { 
    title: r.APP_NAME, 
    page: 'Register',
  });
});

/* POST register page. */
router.post('/register', function (req, res, next) {
  // console.log("Debug: body: %j", req.body);
  console.log(req.body);
  // Table: Users
  let user_name = req.body.user_name;
  let email = db.escape(req.body.email);
  let password = req.body.password;
  let user_image_url = req.body.user_image;
  let description = db.escape(req.body.description);
  let lf_date = req.body.lf_date ? 1 : 0;

  // Table: Location
  let street = req.body.street;
  let city = req.body.city;
  let state = req.body.state;
  let country = req.body.country;
  let code = req.body.code;
  let phone = req.body.phone;

  // Table: Ownership 
  // if pet_owner != ''
  let pet_type = req.body.pet_type;
  let pet_name = req.body.pet_name;
  let pet_image_url = req.body.pet_image;
  let lf_playdate = req.body.lf_playdate ? 1 : 0;
  let lf_adoption = req.body.lf_adoption ? 1 : 0;

  // Table: Services
  // if services != ''
  let service_collection = req.body.service_options;

  bcrypt.hash(password, saltRounds, function (err, hash){
    // Insert into Users table
    let users_sql = `INSERT INTO Users (email, password, user_name, description, user_image_url, lf_date)
      VALUES (${email}, '${hash}', '${user_name}', ${description}, '${user_image_url}', '${lf_date}')`;

    db.query(users_sql, (err, result) => {
      if (err) 
      {
        console.log("Users Error: %j", err);
      } 
      else 
      {
        let location_sql = `INSERT INTO Locations (user_id, street, city, state, country, code, phone)
          VALUES ((SELECT id FROM Users WHERE email = ${email}), '${street}', '${city}', '${state}', '${country}', '${code}', '${phone}')`;

        db.query(location_sql, (err, result) => {
          if (err)
          {
            console.log("Location Error: %j", err);
          } 
          else
          {
            console.log("Location Debug: %j", result);
          }
        });

        // Insert into Ownership table
        let ownership_sql;

        console.log("Debug: ownership: %j", req.body.pet_owner);

        if (typeof req.body.pet_owner !== 'undefined')
        {
          ownership_sql = `INSERT INTO Ownerships (user_id, pet_type, pet_name, pet_image_url, lf_playdate, lf_adoption)
            VALUES ((SELECT id FROM Users WHERE email = ${email}), '${pet_type}', '${pet_name}', '${pet_image_url}', '${lf_playdate}', '${lf_adoption}')`;

          console.log("Debug: ownership sql: %j", ownership_sql);
          db.query(ownership_sql, (err, result) => {
            if (err)
            {
              console.log("Ownership Error: %j", err);
            }
            else
            {
              console.log("Ownership Debug: %j", result);
            }
          });
        };

        // Insert into Services table
        let services_sql;
        if (typeof req.body.services !== 'undefined' && service_collection.length > 0)
        {
          for (let i = 0; i < service_collection.length; i++)
          {
            services_sql = `INSERT INTO Services (user_id, service)
              VALUES ((SELECT id FROM Users WHERE email = ${email}), '${service_collection[i]}')`;

            db.query(services_sql, (err, result) => {
              if (err)
              {
                console.log("Services Error: %j", err);
              }
              else
              {
                console.log("Services Debug: %j", result);
              }
            });
          }
        };
      }
    });

    res.render('index', {
      title: r.APP_NAME,
      page: 'Home',
    });
  });
});

/* GET signin page. */
router.get('/signin', function(req, res, next) {
  res.render('signin', { 
    title: r.APP_NAME, 
    page: 'Signin',
  });
});

router.post('/signin', function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  let sql = `SELECT * FROM Users WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err)
    {
      console.log("Error: %j", err);
    }
    else
    {
      //console.log("Debug: %j", result);
      if (result.length > 0)
      {
        bcrypt.compare(password, result[0].password, function (err, data) {
          if (data)
          {
            console.log("Debug: result %j", result[0]);
            //req.session.user = result[0];
            loggedIn = true;
            currentUserEmail = email;
            res.redirect('/profile');
          }
          else
          {
            res.redirect('/signin');
          }
        });
      }
      else
      {
        res.redirect('/signin');
      }
    }
  });
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { 
    title: r.APP_NAME, 
    page: 'Profile', 
  });
});

/* GET playdate page. */
router.get('/playdate', function(req, res, next) {
  res.render('playdate', { 
    title: r.APP_NAME, 
    page: 'Playdate',
  });
});

/* GET adoption page. */
router.get('/adoption', function(req, res, next) {
  res.render('adoption', { 
    title: r.APP_NAME, 
    page: 'Adoption',
  });
});

/* GET services page. */
router.get('/services', function (req, res, next) {
  res.render('services', {
    title: r.APP_NAME,
    page: 'Services',
  });
});

module.exports = router;