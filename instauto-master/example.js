'use strict';

const puppeteer = require('puppeteer'); // eslint-disable-line import/no-extraneous-dependencies

const Instauto = require('instauto'); // eslint-disable-line import/no-unresolved

const options = {
  cookiesPath: './cookies.json',
  // Will store a list of all users that have been followed before, to prevent future re-following.
  followedDbPath: './followed.json',
  // Will store all unfollowed users here
  unfollowedDbPath: './unfollowed.json',

  username: 'rocketstore00',
  password: 'ROCKETadmin99',

  // Usernames that we should not touch, e.g. your friends and actual followings
  excludeUsers: ['renanrocket'],

  // If true, will not do any actions (defaults to true)
  dryRun: false,
};

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: false, options: ["--disable-gpu", "--no-sandbox", "--window-size=1366x768"] });

    const instauto = await Instauto(browser, options);

    //await instauto.unfollowNonMutualFollowers();

    //await instauto.sleep(10 * 60 * 1000);

    // Unfollow auto-followed users (regardless of whether they are following us)
    // after a certain amount of days
    //await instauto.unfollowOldFollowed({ ageInDays: 2 });

    /*await instauto.sleep(10 * 60 * 1000);*/

    // List of usernames that we should follow the followers of, can be celebrities etc.
    
    const usersToFollowFollowersOf = ['bricksburgerhouse', 'toroburgerandbeer', 'donnacbar', 'thejoespub', 'osufcsobral', 'flagreiufcsobral', 'vinholada', 'brunaagalvao'];

    // Now go through each of these and follow a certain amount of their followers
    for (const username of usersToFollowFollowersOf) {
      await instauto.followUserFollowers(username, { maxFollowsPerUser: 25 });
      await instauto.sleep(1 * 60 * 1000);
    }

    await instauto.sleep(10 * 60 * 1000);
    
    // This is used to unfollow people who have been automatically followed
    // but are not following us back, after some time has passed
    // (config parameter dontUnfollowUntilTimeElapsed)
    await instauto.unfollowNonMutualFollowers();

    await instauto.sleep(10 * 60 * 1000);

    // Unfollow auto-followed users (regardless of whether they are following us)
    // after a certain amount of days
    await instauto.unfollowOldFollowed({ ageInDays: 2 });

    console.log('Done running');

    await instauto.sleep(30000);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Closing browser');
    if (browser) await browser.close();
  }
})();
