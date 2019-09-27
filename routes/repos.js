var express = require('express');
var router = express.Router();
const axios = require('axios');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;


/* GET users listing. */
router.get('/repos/:user/:repo/topics', function(req, res, next) {
  axios.get(`${BASE_URL}/repos/${req.params.user}/${req.params.repo}/topics`)
    .then((response) => {
      const data = response.data;
      
      res.send(data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
