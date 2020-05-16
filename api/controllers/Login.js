'use strict';

const moment = require('moment');
const db = require('../db/DB');
const Response = require('../utils/Response');

module.exports = (req, res) => 
{
	const response = new Response(res, "Login.js");
	const date = moment.utc().toDate().toUTCString();

	response.ok({});
}