require("dotenv").config()

// SEGMENT
const Analytics = require('analytics-node');
const analytics = new Analytics(process.env.SEGMENT_KEY);
// SEGMENT

module.exports = analytics;