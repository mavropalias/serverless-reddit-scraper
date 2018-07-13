import snoowrap, { Listing, Submission } from 'snoowrap';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

// Load .env
dotenv.config();

// Configure AWS
const credentials = new AWS.SharedIniFileCredentials({
  profile: process.env.AWS_PROFILE
});
AWS.config.credentials = credentials;
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  convertEmptyValues: true
});

// Configure snoowrap
const r = new snoowrap({
  userAgent: 'reddit-scraper',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS
});

class RedditScraper {
  fetchedPosts: number = 0;
  successfullyPut: number = 0;
  failed: number = 0;

  getOldPosts(): void {
    r.getTop(process.env.SUBREDDIT, { time: 'all' })
      .fetchAll()
      .then(this.processListing.bind(this));
  }

  getHotPosts(): void {
    r.getHot(process.env.SUBREDDIT, { time: 'day' })
      .fetchAll()
      .then(this.processListing.bind(this));
  }

  processListing(listing: Listing<Submission>): void {
    console.log(`- Fetched ${listing.length} posts`);
    this.processPosts(listing);
  }

  processPosts(postsListing: Listing<Submission>): void {
    const posts = postsListing.filter((post) => {
      if (
        process.env.POST_MINIMUM_UPVOTES &&
        post.ups < +process.env.POST_MINIMUM_UPVOTES
      )
        return false;
      if (typeof post.secure_media_embed.content !== 'string') return false;
      if (
        process.env.POST_FLAIR_TEXT &&
        post.link_flair_text !== process.env.POST_FLAIR_TEXT
      ) {
        return false;
      }
      return true;
    });
    posts.forEach((post) => this.savePost(post));

    this.fetchedPosts += posts.length;
    console.log(`- Accepted ${this.fetchedPosts} posts`);
  }

  savePost(post: Submission): void {
    const params = {
      TableName: 'Clips',
      Item: {
        pk: 'feed',
        sk: post.created_utc.toString(),
        id: post.id,
        created_utc: post.created_utc,
        title: post.title,
        author: post.author.name,
        permalink: post.permalink,
        url: post.url,
        thumbnail: post.thumbnail,
        embed: post.secure_media_embed
      }
      // If you want to save the whole post, use the following:
      // Item: post
    };

    docClient.put(params, (err, data) => {
      if (err) {
        //TODO: handle throttling
        this.failed++;
        console.error(
          `Failed ${this.failed}/${this.fetchedPosts} (current: ${post.id}).`
        );
      } else {
        this.successfullyPut++;
        console.log(`Added ${this.successfullyPut}/${this.fetchedPosts}`);
      }
    });
  }
}

const scraper = new RedditScraper();
scraper.getHotPosts();
