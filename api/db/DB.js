'use strict';

const pg = require('pg');

// configuration for postres for connecting.
let user = "USER", 
    database = "DATABASE", 
    password = "PASSWORD",
    port = 5432,
    host = "localhost";

if(process.env.NODE_ENV == "production")
{
    user = process.env.RDS_USERNAME;
    database = process.env.RDS_DB_NAME;
    password = process.env.RDS_PASSWORD;
    port = process.env.RDS_PORT;
    host = process.env.RDS_HOSTNAME;
}

const pgConfig = {
    user: user,
    database: database,
    password: password,
    port: port,
    host: host
};

// setting timestamp for the postgres.
pg.types.setTypeParser(1184, function(stringValue)
{
    console.log(stringValue)
    return new Date(Date.parse(Date.parse(stringValue + "+0000")))
});

pg.defaults.poolSize = 20;

const pool = new pg.Pool(pgConfig)
    
module.exports = (function ()
{    
    function query(text, params, callback)
    {
        const start = Date.now();
        return pool.query(text, params, (err, res) => 
        {
            if (err)
            {
                console.log(err);
            }

            const duration = Date.now() - start;
            console.log('excuted query', {text, duration : duration+"ms", rows: res.rowCount});
            callback(err, res);
        });
    }

    async function tx(callback, final)
    {
        const client = await pool.connect();
        try 
        {
            await client.query('BEGIN');
            try 
            {
                await callback(client);
                await client.query('COMMIT');
                final();
            } 
            catch (err) 
            {
                await client.query('ROLLBACK');
                final(err);
            }
        } 
        finally 
        {
            client.release();
        }
    }

    return {
        query,
        tx
    };
})();