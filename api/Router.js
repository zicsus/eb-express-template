'use strict';
const express = require('express');
const Tokenizer = require('./utils/Tokenizer');
const Login = require('./controllers/Login');

const router = express.Router();

router.post("/login", Login);

function verifyHeaderToken(req, res, next)
{
    const token = Tokenizer.getToken(req);
    if (token !== undefined)
    {   
        const user = Tokenizer.verify(token);
        if (user)
        {
            req.user = user;
            next();
        }
        else
        {
            res.sendStatus(403);
        }
    }
    else
    {
        res.sendStatus(403);    
    }
}

function verifyCookieToken(req, res, next)
{
    if (req.cookies)
    {
        const token = req.cookies['token'];
        if (token !== undefined)
        {   
            const decoded = Tokenizer.verify(token);
            if (decoded)
            {
                req.id = decoded.id;
                next();
            }
            else
            {
                res.sendStatus(403);
            }
        }
        else
        {
            res.sendStatus(403);    
        }
    }
    else
    {
        res.sendStatus(403);
    }
}

module.exports = router;