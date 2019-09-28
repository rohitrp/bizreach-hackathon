var express = require('express');
var router = express.Router();
const axios = require('axios');
const {
  graphql
} = require("@octokit/graphql");

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;

router.get('/users/:user/topics', async function (req, res, next) {
  await axios.get(`${BASE_URL}/users/${req.params.user}/repos`)
    .then(async (repos) => {
      var topics = [];
      for (var i = 0; i < repos.data.length; i++) {
        const repo = repos.data[i];

        if (repo.topics.length !== 0) {
          topics.push(...repo.topics);
        }
      }

      res.send(topics);

    })
    .catch(error => {
      console.log(error);
    })

});

router.get('/users/:user/repos', async function (req, res, next) {
  // const {
  //   repository
  // } = await graphql(
  //   `
  //   {
  //     viewer {
  //       repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
  //         totalCount
  //         nodes {
  //           nameWithOwner
  //         }
  //         pageInfo {
  //           endCursor
  //           hasNextPage
  //         }
  //       }
  //     }
  //   }
  //   `, {
  //     headers: {
  //       authorization: `token ${ACCESS_TOKEN}`
  //     }
  //   }
  // );

  // console.log(repository);

  axios.get(`${BASE_URL}/users/${req.params.user}/repos`)
    .then((response) => {
      const data = response.data.filter((x) => x.language === 'Java');

      res.send(data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/users/:user/stats', function (req, res, next) {
  res.send({
    'maintainability':63,
    'debugging': 88,
    'flexibility_to_learn': 72,
    'collaboration': 84,
    'general_statistics': 58
  });
});

router.get('/users/:user/collaborators', async function(req, res, next) {
  let collaborators = new Set();

  await axios.get(`/users/${req.params.user}/repos`)
    .then(async (repos) => {
      repos = repos.data;
      for (var i = 0; i < repos.length; i++) {
        const repo = repos[i];
        
        await axios.get(`/repos/${repo.full_name}/collaborators`)
          .then((collabs) => {
            collabs = collabs.data;
            for (var j = 0; j < collabs.length; j++) {
              collaborators.add(collabs[j].login);
            }
          })
          .catch(console.log);
      }
    });
  
  res.send({ 'data': Array.from(collaborators) });
})

router.get('/users/:user/repos/collaborators', async function(req, res, next) {
  let collaborators = {}

  await axios.get(`/users/${req.params.user}/repos`)
    .then(async (repos) => {
      repos = repos.data;
      for (var i = 0; i < repos.length; i++) {
        const repo = repos[i];
        if (!(repo.full_name in collaborators)) {
          collaborators[repo.full_name] = new Set();
        }
        await axios.get(`/repos/${repo.full_name}/collaborators`)
          .then((collabs) => {
            collabs = collabs.data;
            for (var j = 0; j < collabs.length; j++) {
              collaborators[repo.full_name].add(collabs[j].login);
              console.log(collaborators)
            }
          })
          .catch(console.log);
      }
    });
  
  const keys = Object.keys(collaborators);
  for (var i = 0; i < keys.length; i++) {
    collaborators[keys[i]] = Array.from(collaborators[keys[i]]);
  }
  res.send({ 'data': Array.from(collaborators) });
})

module.exports = router;