const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

// Get environment variables with defaults
const DB_NAME = process.env.DB_NAME || "app";
const DB_USER = process.env.DB_USER || "postgres";

// Set file paths
const templatePath = path.resolve(__dirname, "../init-db.sql.template");
const outputPath = path.resolve(__dirname, "../init-db.sql");

// Only create the file if it doesn't exist
if (!fs.existsSync(outputPath)) {
  // Read the template
  let sqlTemplate = fs.readFileSync(templatePath, "utf8");

  // Replace variables
  sqlTemplate = sqlTemplate.replace(/\${DB_NAME}/g, DB_NAME);
  sqlTemplate = sqlTemplate.replace(/\${DB_USER}/g, DB_USER);

  // Write the processed file
  fs.writeFileSync(outputPath, sqlTemplate);
  console.log(
    `Created database initialization script for DB: ${DB_NAME}, User: ${DB_USER}`
  );
} else {
  console.log(
    "Database initialization script already exists, skipping creation."
  );
}
