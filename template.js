const path = require('path');

/**
 * Retrieves the path to a template
 * @param {String} templateName The name of the template
 * @returns The absolute path of the template
 */
module.exports = function template(templateName) {
    return path.join(__dirname, `./${templateName}`)
}