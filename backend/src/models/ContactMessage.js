import mongoose from 'mongoose';

/**
 * Mongoose schema for Contact Inquiries
 * Enforces server-side length constraints, privacy protection, and indexed submission tracking.
 */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      maxlength: [255, 'Email cannot exceed 255 characters'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
      default: 'General Portfolio Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'replied', 'archived'],
      default: 'pending',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    replyText: {
      type: String,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationError: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      select: false, // Protected internal telemetry; excluded from queries by default
    },
    userAgent: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index on createdAt for retention queries and administrative chronological filtering
contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
