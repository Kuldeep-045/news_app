import mongoose from 'mongoose';

const hackerNewsItemSchema = new mongoose.Schema({
  id: { type: Number, required: true},
  url: { type: String },
  hackerNewsUrl: { type: String },
  postedOn: { type: String },
  upvotes: { type: Number },
  comments: { type: Number },
  title: { type: String },
  by: { type: String },
  read:{type:Boolean, default:false},
  isDeleted: { type: Boolean, default: false },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},
});

hackerNewsItemSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

hackerNewsItemSchema.index({ id: 1, user: 1 }, { unique: true });

export const NewsItem = mongoose.model('HackerNewsItem', hackerNewsItemSchema);