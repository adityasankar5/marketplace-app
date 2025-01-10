const Airtable = require("airtable");
require("dotenv").config();

if (!process.env.AIRTABLE_ACCESS_TOKEN || !process.env.AIRTABLE_BASE_ID) {
  throw new Error("Missing Airtable configuration");
}

console.log("Configuring Airtable with:", {
  hasToken: !!process.env.AIRTABLE_ACCESS_TOKEN,
  hasBaseId: !!process.env.AIRTABLE_BASE_ID,
  tokenPrefix: process.env.AIRTABLE_ACCESS_TOKEN.substring(0, 4),
});

Airtable.configure({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
  endpointUrl: "https://api.airtable.com",
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// Test the connection
base("Orders")
  .select({ maxRecords: 1 })
  .firstPage()
  .then((records) => {
    console.log("Successfully connected to Airtable Orders table");
    console.log("Sample record available:", !!records.length);
  })
  .catch((error) => {
    console.error("Error testing Airtable connection:", error);
  });

module.exports = base;
