// Import the compiled backend app
const app = require('../backend/dist/index');

// Export a serverless function handler
module.exports = (req, res) => {
    return app.default ? app.default(req, res) : app(req, res);
};
