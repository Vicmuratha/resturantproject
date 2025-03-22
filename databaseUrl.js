const fs = require('fs');
require('dotenv').config({ path: '.env' });
const { Sequelize } = require('sequelize');

/**
 * Checks whether the env file is present
 * @returns {boolean} true if present, false otherwise
 */
function isEnvFilePresent () {
  return fs.existsSync('.env');
}

/**
 * Retrieves the database url from the environment variables
 * @returns {string} the database's url
 * @throws {Error} in case of missing file or variables
 */
function getDatabaseUrl () {
  // Check if .env file exists
  if (!isEnvFilePresent()) {
    throw new Error('Missing .env file');
  }

  // Fetch the environment variables values
  const dbName = process.env.DB_NAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbUsername = process.env.DB_USERNAME;
  const dbPort = process.env.DB_PORT;
  const dbHost = process.env.DB_HOST;

  // Check if all values were provided
  if (!dbName || !dbPassword || !dbUsername || !dbPort || !dbHost) {
    throw new Error('Missing values in .env file');
  }

  return `mysql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

/**
 * Attempts connecting to the database
 * @param url {string} the database's url
 * @returns {boolean} true if connected
 * @throws {Error} In case of any errors during connection
 */
async function attemptDatabaseConnection (url) {
  try {
    // Create a sequelize object
    const sequelize = new Sequelize(url, { logging: false });

    // Attempt connecting to the database
    await sequelize.authenticate();
    return true;
  } catch (error) {
    throw new Error(`Unable to connect to database: ${error.message}`);
  }
}
module.exports = { getDatabaseUrl, attemptDatabaseConnection };
