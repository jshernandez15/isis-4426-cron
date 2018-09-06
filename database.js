var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'p0_user',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_SCHEMA || 'proyecto0'
});

pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query('select id_video, path_real from proyecto0.videos where state_video = "process"', function(error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
        connection.release();

        if (error) throw error;
    });
});