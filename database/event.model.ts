import { Schema, model, models, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt
);

// Pre-save hook: handle slug generation, date formatting, and time normalization
EventSchema.pre('save', function () {
  // Generate URL-friendly slug if title is new or updated
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Normalize date to ISO format if provided/changed
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format provided for Event.');
    }
    this.date = parsedDate.toISOString();
  }

  // Ensure time is consistently formatted (e.g., trim whitespace)
  if (this.isModified('time')) {
    this.time = this.time.trim();
  }
});

EventSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = this.getUpdate() as any;
  if (!update) return;

  const title = update.title || update.$set?.title;
  if (title) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.slug = slug;
    }
  }

  const date = update.date || update.$set?.date;
  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format provided for Event.');
    }
    const isoDate = parsedDate.toISOString();
    if (update.$set) {
      update.$set.date = isoDate;
    } else {
      update.date = isoDate;
    }
  }

  const time = update.time || update.$set?.time;
  if (time) {
    const trimmedTime = time.trim();
    if (update.$set) {
      update.$set.time = trimmedTime;
    } else {
      update.time = trimmedTime;
    }
  }
});

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
