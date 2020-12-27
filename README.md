# reddit-scraper

## What is this?

This is a Reddit scraper that monitors a subreddit and stores new threads in Amazon DynamoDB.

## Install

`npm i`

Create `.env` at root with the following variables, specific to your Reddit app: https://www.reddit.com/prefs/apps/

```bash
AWS_PROFILE=***
CLIENT_ID=***
CLIENT_SECRET=***
POST_FLAIR_TEXT=***
POST_MINIMUM_UPVOTES=1
REDDIT_USER=***
REDDIT_PASS=***
SUBREDDIT=***
```

`AWS_PROFILE` refers to the corresponding section in your ~/.aws/credentials file. For example:

```bash
[default] ; default profile
aws_access_key_id = <DEFAULT_ACCESS_KEY_ID>
aws_secret_access_key = <DEFAULT_SECRET_ACCESS_KEY>

[personal-account] ; personal account profile
aws_access_key_id = <PERSONAL_ACCESS_KEY_ID>
aws_secret_access_key = <PERSONAL_SECRET_ACCESS_KEY>
```

## Usage

`npm start`
