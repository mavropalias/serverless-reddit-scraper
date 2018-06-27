# reddit-scraper

## What is this?

This is a Reddit scraper that monitors a specified subreddit and stores new threads in Amazon DynamoDB.

## Install

`npm i`

Create `.env` at root with the following variables, specific to your Reddit app: https://www.reddit.com/prefs/apps/

```
CLIENT_ID=***
CLIENT_SECRET=***
REDDIT_USER=***
REDDIT_PASS=***
```

## Usage

`npm start`
