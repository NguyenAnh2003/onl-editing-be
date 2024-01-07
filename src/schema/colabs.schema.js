import mongoose from 'mongoose';

const colabSchema = mongoose.Schema({
  /** _id, pageId, userId */
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  username: { type: String, require: true },
  mode: { type: String, require: true },
  joinDate: { type: mongoose.Schema.Types.Date, default: Date.now },
});

const Colab = mongoose.model('colab', colabSchema);

export default Colab;
