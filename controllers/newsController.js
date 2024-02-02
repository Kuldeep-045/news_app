import {NewsItem} from '../models/news.js';
import {User} from "../models/user.js"
import fetch from 'node-fetch';

export const fetchAndStoreNews = async (req, res) => {
  try {
    // Fetching news from Hacker News API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    const newStoriesIds = await response.json();

    // Iterate over news items
    const userId=req.user._id;
    for (const storyId of newStoriesIds.slice(0, 90)) {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
      const storyDetails = await storyResponse.json();

      // Extracting relevant details
      const { id, url, score, descendants, title, by, time } = storyDetails;

      // Check if the news item already exists in the database
      const existingNewsItem = await NewsItem.findOne({ id, user:userId });

      if (existingNewsItem) {
        // If it exists, update upvotes and comments
        existingNewsItem.upvotes = score;
        existingNewsItem.comments = descendants;
        await existingNewsItem.save();
      } else {
        // If it doesn't exist, create a new NewsItem instance
        const hackerNewsItem = new NewsItem({
          id,
          url,
          hackerNewsUrl: `https://news.ycombinator.com/item?id=${id}`,
          postedOn: new Date(time * 1000).toLocaleString(), // Convert Unix timestamp to human-readable date
          upvotes: score,
          comments: descendants,
          title,
          by,
          user:userId
        });

        // Save the news item to the database
        await hackerNewsItem.save();
      }
    }

    res.json({ success: true, message: 'News fetched and stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
