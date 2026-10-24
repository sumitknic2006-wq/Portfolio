import mongoose from 'mongoose';

/**
 * Mongoose schema for Contact Inquiries (Phase 4 integration)
 */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'archived'],
      default: 'pending',
    },
    ipAddress: {
      type: String,
      select: false, // Protected internal telemetry
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

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
