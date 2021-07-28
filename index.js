const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger');
const members = require('./Members');
const analytics = require('./Segment.js');
const moment = require('moment');

// Init express and port
const app = express();
const PORT = process.env.PORT || 5000;

// Logger middleware
app.use(logger);
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))
// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Homepage Route
app.get('/', (req, res) => {

    // SEGMENT
    analytics.page({
        anonymousId: '48d213bb-95c3-4f8d-af97-86b2b404dcfe',
        category: 'Test',
        name: 'Members Page',
        properties: {
          url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
          path: req.originalUrl,
          title: 'Members Page - Segment',
          timestamp: moment().format()
        }
      });
    // SEGMENT

    res.render('index', {
        title: 'Member App',
        members: members
    })
});

// Set a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Import and reference ./routes/api/members for /api/members route
app.use('/api/members', require('./routes/api/members'))

// Listen on PORT constant
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});