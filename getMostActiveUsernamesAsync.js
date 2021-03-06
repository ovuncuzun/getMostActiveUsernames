'use strict';

const fs = require('fs');
const https = require('https');
const fetch = require("node-fetch");

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');
    main();
    console.log('process end');
});

function readLine() {
    return inputString[currentLine++];
}

async function getMostActiveUsernames(threshold) {
    let users = [];
    let mostActiveUsers = [];
    let pageNum = 1;
    let url = 'https://jsonmock.hackerrank.com/api/article_users?page=' + pageNum;
    let response = await fetch(url);
    let json = await response.json();

    for (let i = 0; i < json.data.length; i++) {
        users.push(json.data[i]);
    }

    for (let i = 2; i <= json.total_pages; i++) {
        url = 'https://jsonmock.hackerrank.com/api/article_users?page=' + i;
        let response = await fetch(url);
        json = await response.json();
        for (let i = 0; i < json.data.length; i++) {
            users.push(json.data[i]);
        }

        if (i === json.total_pages) {
            let filteredUsers = users.filter((user) => {
                return user.comment_count > threshold;
            });

            filteredUsers.forEach((user) => {
                mostActiveUsers.push(user.username);
            });
        }

        return mostActiveUsers;
    }
}

async function main() {
    const ws = fs.createWriteStream('output.txt');
    const threshold = parseInt(readLine().trim(), 10);
    const result = await getMostActiveUsernames(threshold);
    console.log(result);
    ws.write(result.join('\n') + '\n');
    ws.end();
}
