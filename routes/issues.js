var express = require('express');
var router = express.Router();
const axios = require('axios');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;
const LOCALHOST_BASE_URL = process.env.LOCALHOST_BASE_URL;

axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;

router.get('/users/:user/issues', function (req, res, next) {

    axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
        .then((response) => {
            getIssues(response, res, req)
        })
        .catch(error => {
            console.log(error);
        });
});

async function getIssues(response, res, req) {
    var completed_issues = 0,
        total_issues = 0;

    for (var i = 0; i < response.data.length; i++) {
        var repoName = response.data[i].nameWithOwner;

        await axios.get(`${BASE_URL}/repos/${repoName}/issues?state=all`)
            .then((responseIssue) => {
                completed_issues++;
                //console.log("*********************")
                for (var i = 0; i < responseIssue.data.length; i++) {
                    // console.log(responseIssue.data[i]);

                    for (var j = 0; j < responseIssue.data[i].assignees.length; j++) {
                        if (responseIssue.data[i].assignees[j].login === req.params.user) {
                            if (responseIssue.data[i].state === 'closed') {
                                completed_issues++;
                            }
                        }
                    }
                    total_issues++;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    console.log(completed_issues);
    console.log(total_issues);
    if (total_issues === 0) {
        res.send({
            'data': 100
        });
    } else {
        res.send({
            'data': (completed_issues / total_issues) * 100
        });
    }

}

module.exports = router;