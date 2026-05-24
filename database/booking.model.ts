import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model'; // Import to validate reference

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true // Index for faster queries
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt
);

// Pre-save hook: Verify referenced eventId exists in the database
BookingSchema.pre('save', async function () {
  if (this.isModified('eventId') || this.isNew) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error('The referenced Event does not exist.');
    }
  }
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
