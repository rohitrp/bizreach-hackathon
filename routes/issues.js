var express = require('express');
var router = express.Router();
const axios = require('axios');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;
const LOCALHOST_BASE_URL = process.env.LOCALHOST_BASE_URL;

axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;



router.get('/users/:user/repo/issues/objects', function (req, res, next) {
    console.log(req.params.user);
    axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
        .then((response) => {
            getAllIssuesForEachRepo(response.data, res, req)
        })
        .catch(error => {
            console.log(error);
        });
});




router.get('/users/:user/issues', function (req, res, next) {

    axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
        .then((response) => {
            getIssues(response, res, req)
        })
        .catch(error => {
            console.log(error);
        });
});

router.get('/user/:user/repo/issues/fraction', function (req, res, next) {
    axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
        .then((response) => {
            getIssuesForOneRepo(response.data, res, req)

        })
        .catch(error => {
            console.log(error);
        });
});

function getIssuesForOneRepo(response, res, req) {
    var numberOfrepos = response.length;
    var completed_requests = 0;
    for (var i = 0; i < response.length; i++) {
        let repoName = response[i].nameWithOwner;
        let tempResponse = response[i]
        console.log(repoName);
        var finishedIssue = 0;
        var arrayOfFractions = [];
        axios.get(`${BASE_URL}/repos/${repoName}/issues?state=all`)
            .then((responseIssue) => {
                const data = responseIssue.data.length;
                completed_requests++;
                var allIssuesInRepo = 0;
                //console.log("*********************")
                for (var i = 0; i < responseIssue.data.length; i++) {
                    for (var j = 0; j < responseIssue.data[i].assignees.length; j++) {
                        if (responseIssue.data[i].assignees[j].login === req.params.user) {
                            if(responseIssue.data[i].state === "closed"){
                                finishedIssue++;
                            }
                            allIssuesInRepo++;
                        }
                    }
                }

                if(allIssuesInRepo === 0)
                    arrayOfFractions = [...arrayOfFractions, { name: tempResponse.nameWithOwner, fraction: 100 }];
                else
                arrayOfFractions = [...arrayOfFractions, { name: tempResponse.nameWithOwner, fraction: finishedIssue/allIssuesInRepo * 100 }];
                if (completed_requests === numberOfrepos) {
                    //    console.log(arrayOfFractions);
                    res.send({'data': arrayOfFractions});
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

}

//-----------------------------------------------------------------------------------------------




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


function getAllIssuesForEachRepo(response, res, req) {

    var numberOfrepos = response.length;
    var allIssues = [{labels: ["number of assgined issues", "number of closed issues"]} ];
    console.log(numberOfrepos);
    var completed_requests = 0;
    for (var i = 0; i < response.length; i++) {
        var repoName = response[i].nameWithOwner;
        console.log(repoName);
        var numberOfIssues = 0;
        var numberOfClosedIssues = 0;
        axios.get(`https://api.github.com/repos/${repoName}/issues`)
            .then((responseIssue) => {
                completed_requests++;
                responseIssue = responseIssue.data;
                console.log(responseIssue);

                console.log("*********************")
            //    console.log(response.data)
                var repoIssues = [];
                for (var i = 0; i < responseIssue.length; i++) {
                    for (var j = 0; j < responseIssue[i].assignees.length; j++) {
                        if (responseIssue[i].assignees[j].login === req.params.user) {
                            numberOfIssues++;
                            if (responseIssue.data[i].state === 'closed') {
                                numberOfClosedIssues++;
                            }
                        }
                    }
                }
                repoIssues = [...repoIssues, {nameWithOwner: repoName, values: [numberOfIssues, numberOfClosedIssues] } ];
                if (completed_requests === numberOfrepos) {
                    //console.log(allIssues);
                    allIssues = [...allIssues, {repos: repoIssues}];
                    res.send({'data': allIssues});
                }

            })
            .catch(error => {
                console.log(error);
            });
    }
}


module.exports = router;
