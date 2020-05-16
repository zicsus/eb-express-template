const jwt = require('jsonwebtoken');
const fs = require("fs");

module.exports = (function ()
{
    function generate(payload)
    {
        let options = { 
            subject: 'authorization',
            algorithm: 'RS256',
            expiresIn: '45d',
            issuer: 'Hoverify'
        };

        let privateKey = fs.readFileSync("./api/secret/private.key", "utf-8");
        try
        {
            const token = jwt.sign(payload, privateKey, options);
            return token;
        }
        catch(err)
        {
            return undefined;
        }
    }

    function verify(token)
    {
        let verifyOption = {
            subject: 'authorization',
            algorithms: ['RS256'],
            maxAge: '45d',
            issuer: 'Hoverify'
        };

        let publicKey = fs.readFileSync("./api/secret/public.key", "utf-8");

        try
        {
            const verified = jwt.verify(token, publicKey, verifyOption);
            return verified;
        }
        catch (err)
        {
            return undefined;
        }
    }

    function decode(token)
    {
        try
        {
            var decoded = jwt.decode(token);
            return decoded;
        }
        catch (err)
        {
            return undefined;
        }
    }

    function getToken(req)
    {
        const bearerHeader = req.headers.authorization;
        if(bearerHeader)
        {
            const bearer = bearerHeader.split(' ')
            
            if(bearer.length == 2 && bearer[0] == "Bearer")
            {
                const bearerToken = bearer[1];
                return bearerToken;
            }
            else
            {
                return undefined;
            }            
        }
        else
        {
            return undefined;
        }
    }

    return {
        generate,
        verify,
        decode,
        getToken
    };
})();