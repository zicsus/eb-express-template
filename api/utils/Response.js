'use strict';

const Tokenizer = require('./Tokenizer');

module.exports = function(res, controller)
{
    this.res = res;
    this.controller = controller;

    this.setCookie = (id) => 
    {
        const token = Tokenizer.generate({ id });
        if(token !== undefined)
        {
            this.res.cookie('token', token, {maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
        }
    };

    this.clearCookie = (name) => 
    {
        this.res.clearCookie(name);
    }

    this.ok = (message) =>
    {
        return this.res.json({
            status:':)', 
            data:message, 
            error: {}
        });
    }

    this.error = (message) =>
    {
        console.error(this.controller, message);
        return this.res.json({
            status:':(',
            error: {
                message: message
            },
            data: {}
        });
    }
}