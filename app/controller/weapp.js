'use strict';

const Controller = require('egg').Controller;

class WeappController extends Controller {
  async ticket() {
    const ctx = this.ctx;
    let accessData = '';
    const ticket = await ctx.service.ticket.getTicket();
    if (!ticket) {
      accessData = await ctx.service.ticket.fetchTicket();
      const newTicket = {
        access_token: accessData.access_token,
        expires_in: accessData.expires_in,
      };
      await ctx.service.ticket.saveTicket(newTicket);
      if (accessData.errcode) {
        this.ctx.body = {
          res_code: accessData.errcode,
          res_msg: accessData.errmsg,
        };
      } else {
        this.ctx.body = {
          res_code: 0,
          res_msg: 'success',
          data: newTicket,
        };
      }
    } else {
      this.ctx.body = {
        res_code: 0,
        res_msg: 'success',
        data: {
          access_token: ticket.access_token,
          expires_in: ticket.expires_in,
        },
      };
    }
  }
}

module.exports = WeappController;
