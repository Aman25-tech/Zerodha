require('dotenv').config();

const config = {
    polygon: {
        apiKey: process.env.POLYGON_API_SECRET
    },
    finnhub: {
        apiKey: process.env.FINNHUB_API_SECRET
    },
    alphavantage: {
        apiKey: process.env.ALPHAVANTAGE_API_KEY
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    db: {
        uri: process.env.MONGODB_URI
    },
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;