import mongoose from 'mongoose';

const documentSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
});

const Doc = mongoose.model('Document', documentSchema);

export default Doc;
