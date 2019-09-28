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

function getIssues(response, res, req) {
    var numberOfrepos = response.data.length;
    console.log(numberOfrepos);
    for (var i = 0; i < response.data.length; i++) {
        var repoName = response.data[i].name;
      //  console.log(repoName);
        var completed_requests = 0;
        axios.get(`${BASE_URL}/repos/${req.params.user}/${repoName}/issues?state=all`)
            .then((responseIssue) => {
                const data = responseIssue.data.length;
                completed_requests++;
                var finalResponse = 0;
                //console.log("*********************")
                for (var i = 0; i < responseIssue.data.length; i++) {
                    for (var j = 0; j < responseIssue.data[i].assignees; j++) {
                        if (responseIssue.data[i].assignees[j].login === req.params.user) {
                            finalResponse++;
                        }
                    }
                }
                if (completed_requests === numberOfrepos) {
                    console.log(finalResponse);
                    //res.send(finalResponse);
                    if(finalResponse !== 0)
                         getClosedIssues(res, finalResponse, response.data, req)
                    else
                        res.send({'data': 100 })
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

}

function getClosedIssues(res, numberOfIssues, repos, req) {

    var numberOfrepos = repos.length;
    //console.log(numberOfrepos);
    for (var i = 0; i < repos.length; i++) {
        var repoName = repos[i].name;
        // console.log(repoName);
        var completed_requests = 0;
        axios.get(`${BASE_URL}/repos/${req.params.user}/${repoName}/issues?state=closed`)
            .then((responseIssue) => {
                const data = responseIssue.data.length;
                completed_requests++;
                var finalResponse = 0;
                //console.log("*********************")
                for (var i = 0; i < responseIssue.data.length; i++) {
                    for (var j = 0; j < responseIssue.data[i].assignees; j++) {
                        if (responseIssue.data[i].assignees[j].login === req.params.user) {
                            finalResponse++;
                        }
                    }
                }
                if (completed_requests === numberOfrepos) {
                    // All download done, process responses array
                    console.log(numberOfIssues);
                    console.log(finalResponse)
                    res.send({'data': finalResponse / numberOfIssues});
                }

            })
            .catch(error => {
                console.log(error);
            });
    }
}


module.exports = router;
