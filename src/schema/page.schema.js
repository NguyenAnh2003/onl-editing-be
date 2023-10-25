import mongoose from 'mongoose';

const pageSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
});

const Page = mongoose.model('Page', pageSchema);

export default Page;
