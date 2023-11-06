import mongoose from 'mongoose';

/**
 * Page name
 * Content (Delta)
 * Mode (private, public)
 * Timestamp
 * colabs (userId)
 */
const pageSchema = mongoose.Schema(
  /** data */
  {
    /** UserId required: true*/
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    /** Page name */
    name: {
      type: String,
      required: true,
    },
    /** Content */
    content: {
      type: Object,
    },
    mode: {
      type: String,
    },
  },
  /** Timestamp */
  {
    timestamp: true,
  }
);

const Page = mongoose.model('Page', pageSchema);

export default Page;
