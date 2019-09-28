var express = require('express');
var router = express.Router();
const axios = require('axios');

require('dotenv').config();

const ACCESS_TOKEN = 'a6d96fb6d70c09403da480f060bf0aee2c54d809';
const BASE_URL = 'https://api.github.com';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;

router.get('/repos/:user/issues', function (req, res, next) {

    axios.get(`/users/${req.params.user}/repos`)
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
                    // All download done, process responses array
                    console.log(finalResponse);
                    //res.send(finalResponse);
                    if(finalResponse != 0)
                         getOpenIssues(res, finalResponse, response.data, req)
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

}

function getOpenIssues(res, numberOfIssues, repos, req) {

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
                    res.send(finalResponse / numberOfIssues);
                }

            })
            .catch(error => {
                console.log(error);
            });
    }
}


module.exports = router;
