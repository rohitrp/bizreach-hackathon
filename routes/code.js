var express = require('express');
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var router = express.Router();
const axios = require('axios');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `token ${ACCESS_TOKEN}`;
axios.defaults.headers.common['Accept'] = `application/vnd.github.mercy-preview+json`;

const countLine = function(script){
    let res = 0;
    script = script.replace(" ", "");
    let lines = script.split("\n");
    for (let i = 0; i < lines.length; i++)
        if (lines[i].length > 0)
            res++;
    return res;
}

const countComment = function(script){
    let res = 0;
    script = script.replace(" ", "");
    let lines = script.split("\n");
    let check = false;
    for (let i = 0; i < lines.length; i++)
        if (lines[i].length > 0){
            if (lines[i].includes("/*")) check = true;
            if (check || lines[i].includes("//")) res++;
            if (lines[i].includes("*/")) check = false;
        }
    return res;
}

const countWarning = function(audit, keywords){
    let res = 0;
    for (let i = 1; i < audit.length - 1; i++)
        for (let j = 0; j < keywords.length; j++)
            if (audit[i].includes(keywords[j])){
                res++;
                break;
            }
    return res;
}

const getStyleConsistency = async function(script){
    // Write the java script to a file and check style
    try{
        fs.writeFileSync("assets\\checkstyle\\script.java", script);
        let {err, stdout, stderr} = await exec(
            "java -jar checkstyle-8.24-all.jar -c /google_checks.xml script.java > out", 
            {
                cwd: 'assets\\checkstyle'
            });
        if (err){
            console.log(err);
        } else {
            let audit = fs.readFileSync("assets\\checkstyle\\out", 'utf8');
            let line_count = countLine(script);
            let comment_count = countComment(script);
            let warning_count = Math.max(0, audit.length - 2);
            let naming_warning_count = countWarning(audit, ["Name"]);
            let format_warning_count = countWarning(audit, ["No", "Missing", "Unnecessary"]);
            return {
                "comment": (comment_count / line_count) * 100,
                "style": (1.0 - parseFloat(Math.min(warning_count, line_count)) / line_count) * 100,
                "variable": (1.0 - parseFloat(naming_warning_count) / line_count) * 100,
                "format": (1.0 - parseFloat(format_warning_count) / line_count) * 100
            }
        }
    } catch (error){
        console.log(error);
    }
    return {
        "comment": Math.random() * 100,
        "style": Math.random() * 100,
        "variable": Math.random() * 100,
        "format": Math.random() * 100
    }
}

router.get('/code/:user/:repo', async function(req, res, next) {
    axios.get(`${BASE_URL}/repos/${req.params.user}/${req.params.repo}/commits`)
    .then(async (response_commits) => {
        const data = response_commits.data;
        let maintainability = {"comment": 0, "style": 0, "variable": 0, "format": 0};
        let count = 0;
        // Loop through commits
        for (let i = 0; i < data.length; i++){
            let sha = data[i].sha;
            try {
                let response_single = await axios.get(`${BASE_URL}/repos/${req.params.user}/${req.params.repo}/commits/${sha}`);
                let files = response_single.data.files;
                //Loop through files
                for (let j = 0; j < files.length; j++){
                    // Only get java scripts
                    if (files[j].filename.endsWith(".java")){
                        try{
                            let response_file = await axios.get(files[j].raw_url);
                            let consistency = await getStyleConsistency(response_file.data);
                            maintainability.comment += consistency.comment;
                            maintainability.style += consistency.style;
                            maintainability.variable += consistency.variable;
                            maintainability.format += consistency.format;
                            count++;
                        }catch(error){
                            console.log(error);
                        }
                        if (count >= 10) break;
                    }
                }
            } catch (error){
                console.log(error);
            }
            if (count >= 10) break;
        }
        res.send({
            "comment": maintainability.comment / count, 
            "style": maintainability.style / count,
            "variable": maintainability.variable / count,
            "format": maintainability.format / count
        });
    })
    .catch(error => {
        console.log(error);
    });
});

router.get('/code/:user/:repo/commits', async function(req, res, next) {
    axios.get(`${BASE_URL}/repos/${req.params.user}/${req.params.repo}/commits`)
    .then(async (response_commits) => {
        const data = response_commits.data;
        let scripts = [];
        // Loop through commits
        for (let i = 0; i < data.length; i++){
            let sha = data[i].sha;
            try {
                let response_single = await axios.get(`${BASE_URL}/repos/${req.params.user}/${req.params.repo}/commits/${sha}`);
                let files = response_single.data.files;
                //Loop through files
                for (let j = 0; j < files.length; j++){
                    // Only get java scripts
                    if (files[j].filename.endsWith(".java")){
                        try{
                            let response_file = await axios.get(files[j].raw_url);
                            let consistency =  await getStyleConsistency(response_file.data);
                            scripts.push({"filename": files[j].filename, "style-consistency": consistency});
                        }catch(error){
                            console.log(error);
                        }
                    }
                    if (scripts.length >= 10) break;
                }
            } catch (error){
                console.log(error);
            } 
            if (scripts.length >= 10) break; 
        }
        res.send({"scripts": scripts});
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;
