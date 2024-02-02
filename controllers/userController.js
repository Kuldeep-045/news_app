import {NewsItem} from '../models/news.js';


export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const {read}= req.body

    // Use findOneAndUpdate to update the isDeleted field
    const newsItem = await NewsItem.findById(id);
    
    // Check if newsItem is found and updated
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'New Item is not find' });
    }
    newsItem.read=read || false;
    newsItem.save()

    res.json({ success: true, newsItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


export const deleteNewsItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Use findOneAndUpdate to update the isDeleted field
    const deletedNewsItem = await NewsItem.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    // Check if newsItem is found and soft deleted
    if (!deletedNewsItem) {
      return res.status(404).json({ success: false, error: 'News item not found' });
    }

    res.json({ success: true, message: 'News item soft deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


export const getUserNewsItems = async (req, res) => {
  try {
    const userId=req.user._id
    const allUserNewsItems = await NewsItem.find({user:userId}).sort({ postedOn: -1 });
    res.status(200).json(allUserNewsItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getUserNewsItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Use findById to find the news item by ID
    const newsItem = await NewsItem.findById(id);

    // Check if newsItem is found
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News item not found' });
    }

    res.json( newsItem );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
