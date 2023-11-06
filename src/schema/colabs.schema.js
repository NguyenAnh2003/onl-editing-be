import mongoose from 'mongoose';

const colabSchema = mongoose.Schema(
  {
    /** _id, pageId, userId */
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  } /** Timestamp */,
  {
    timestamp: true,
  }
);

const Colab = mongoose.model('colab', colabSchema);

export default Colab;
