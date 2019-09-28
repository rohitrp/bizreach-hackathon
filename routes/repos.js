var express = require("express");
var router = express.Router();
const axios = require("axios");
const { graphql } = require("@octokit/graphql");

require("dotenv").config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;
const LOCALHOST_BASE_URL = process.env.LOCALHOST_BASE_URL;

axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;

const getURLs = async function(topics){
  let urls = [];
  for (let i = 0; i < topics.length; i++){
    try{
      response = await axios.get(`https://github.com/topics/${topics[i]}`);
      urls.push("");
    } catch (error){
      console.log(error);
      urls.push("");
    }
  }
  return urls;
}

router.get('/users/:user/topics', async function (req, res, next) {
  await axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
    .then(async (repos) => {
      var topics = [];
      for (var i = 0; i < repos.data.length; i++) {
        const repo = repos.data[i];

        if (repo.topics.length !== 0) {
          topics.push(...repo.topics);
        }
      }

      urls = await getURLs(topics);
      res.send({'topics': topics, 'urls': urls});
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/users/:user/repos", async function(req, res, next) {
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

  axios.post(`https://api.github.com/graphql`, 
    {
      'query':
    `
    {
      repositoryOwner(login:"rohitrp"){
        repositories(first:100) {
          edges {
            node {
              id
              name
              nameWithOwner
              url
              primaryLanguage {
                id
                name
              }
            }
          }
        }
      }
    }    
    `
  }
  ).then(response => {
      response = response.data.data.repositoryOwner.repositories.edges;
      console.log(response);
      const data = response.filter(x => {
        if (x.node.primaryLanguage) {
          if(x.node.primaryLanguage.name === "Java") return true;
        } else {
          return false;
        }
      });

      res.send(data);
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/users/:user/stats', async function (req, res, next) {
  let debugging = 0, maintainability = 0, flexibility_to_learn = 0, collaboration = 0, general_statistics = 0;

  await axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/issues`)
    .then((response) => {
      debugging = response.data.data;
    })
    .catch(console.log);

  res.send({
    'maintainability':63,
    'debugging': debugging,
    'flexibility_to_learn': 72,
    'collaboration': 84,
    'general_statistics': general_statistics
  });
});

router.get("/users/:user/collaborators", async function(req, res, next) {
  let collaborators = new Set();


  await axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
    .then(async (repos) => {
      repos = repos.data;
      for (var i = 0; i < repos.length; i++) {
        const repo = repos[i];
        
        await axios.get(`${LOCALHOST_BASE_URL}/repos/${repo.full_name}/collaborators`)
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

  await axios.get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
    .then(async (repos) => {
      repos = repos.data;
      for (var i = 0; i < repos.length; i++) {
        const repo = repos[i];
        if (!(repo.full_name in collaborators)) {
          collaborators[repo.full_name] = new Set();
        }
        await axios.get(`${BASE_URL}/repos/${repo.full_name}/collaborators`)
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
  res.send({ data: Array.from(collaborators) });
});

// Returns {repoName: NoOfStars, .....}
router.get(`/users/:user/starCountMap`, async function(req, res, next) {
  await axios
    .get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
    .then(async repos => {
      let repoStarCountMap = {};
      let data = repos.data;
      data.forEach(element => {
        let repoName = element.name;
        let starGazersCount = element.stargazers_count;
        repoStarCountMap[repoName] = starGazersCount;
      });
        res.send(repoStarCountMap);
    })
    .catch(console.log);
});

// Returns {score for stars: 0 < 100}
router.get(`/users/:user/starScore`, async function(req, res, next) {
  await axios
    .get(`${LOCALHOST_BASE_URL}/users/${req.params.user}/repos`)
    .then(async repos => {
      let repoStarCountMap = {};
      let data = repos.data;
      data.forEach(element => {
        let repoName = element.name;
        let starGazersCount = element.stargazers_count;
        repoStarCountMap[repoName] = starGazersCount;
      });
      let totalCount = 0;
      for (let repoName in repoStarCountMap) {
        totalCount += repoStarCountMap[repoName];
      }
      let score = 0;
      if (totalCount < 10) {
        score = 10;
      } else if (totalCount < 1000) {
        score = 20;
      } else if (totalCount < 10000) {
        score = 30;
      } else if (totalCount < 100000) {
        score = 40;
      } else if (totalCount < 100000) {
        score = 50;
      } else if (totalCount < 1000000) {
        score = 60;
      } else if (totalCount < 10000000) {
        score = 70;
      } else if (totalCount < 100000000) {
        score = 80;
      } else if (totalCount < 1000000000) {
        score = 90;
      } else {
        score = 100;
      }
      res.send({starScore: score});
    })
    .catch(console.log);
});

module.exports = router;
