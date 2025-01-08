require("dotenv").config();
const Airtable = require("airtable");

async function testAirtableConnection() {
  try {
    // Log environment variables (without showing actual values)
    console.log("Environment variables loaded:", {
      hasToken: !!process.env.AIRTABLE_ACCESS_TOKEN,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
    });

    // Configure Airtable
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
    });

    console.log("Attempting to connect to base...");

    const base = airtable.base(process.env.AIRTABLE_BASE_ID);

    // Try to fetch records
    console.log("Attempting to fetch records...");

    const records = await base("Products")
      .select({
        maxRecords: 1,
      })
      .firstPage();

    console.log("Successfully connected to Airtable!");
    console.log("Found", records.length, "records");
  } catch (error) {
    console.error("Connection failed:", {
      message: error.message,
      statusCode: error?.statusCode,
      type: error?.error,
    });
  }
}

testAirtableConnection();
