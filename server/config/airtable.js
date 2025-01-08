const Airtable = require("airtable");
require("dotenv").config();

// Configure Airtable
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID);

module.exports = base;
