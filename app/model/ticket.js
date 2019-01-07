'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TicketSchema = new Schema({
    ticket: { type: String },
    expiresIn: { type: String },
  });

  return mongoose.model('Ticket', TicketSchema);
};
