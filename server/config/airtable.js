const Airtable = require("airtable");
require("dotenv").config();

if (!process.env.AIRTABLE_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
  console.error("Missing required Airtable configuration");
  process.exit(1);
}

// Log configuration (without showing actual values)
console.log("Airtable Configuration:", {
  hasToken: !!process.env.AIRTABLE_ACCESS_TOKEN,
  hasBaseId: !!process.env.AIRTABLE_BASE_ID,
});

const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID);

// Test the connection
base("Products")
  .select({
    maxRecords: 1,
  })
  .firstPage()
  .then(() => console.log("Successfully connected to Airtable"))
  .catch((error) => console.error("Error connecting to Airtable:", error));

module.exports = base;
