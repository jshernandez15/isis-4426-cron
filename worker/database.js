'use strict';

const dbOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'p0_user',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_SCHEMA || 'proyecto0'
};

module.exports = dbOptions;