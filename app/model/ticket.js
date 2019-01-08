'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TicketSchema = new Schema({
    name: { type: String },
    access_token: { type: String },
    expires_in: { type: Number },
    meta: {
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  });

  TicketSchema.pre('save', function(next) {
    if (this.isNew) {
      this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
      this.meta.updatedAt = Date.now();
    }
    next();
  });

  return mongoose.model('Ticket', TicketSchema);
};
