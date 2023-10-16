import mongoose from 'mongoose';

const documentSchema = mongoose.Schema({
  data: {
    type: Object,
  },
  owner: {
    type: String,
    required: true,
  },
});

const Doc = mongoose.model('Document', documentSchema);

export default Doc;
