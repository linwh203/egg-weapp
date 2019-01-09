'use strict';

const Controller = require('egg').Controller;

class WeappController extends Controller {
  async token() {
    const ctx = this.ctx;
    const token = await ctx.service.token.getToken();
    if (token.errcode) {
      this.ctx.body = {
        res_code: token.errcode,
        res_msg: token.errmsg,
      };
    } else {
      this.ctx.body = {
        res_code: 0,
        res_msg: 'success',
        data: {
          access_token: token.access_token,
          expires_in: token.expires_in,
        },
      };
    }
  }
  async ticket() {
    const ctx = this.ctx;
    // 先获取token
    const token = await ctx.service.token.getToken();
    if (token.errcode) {
      this.ctx.body = {
        res_code: token.errcode,
        res_msg: token.errmsg,
      };
    } else {
      const ticket = await ctx.service.ticket.getTicket(token.access_token);
      if (ticket.errcode !== 0) {
        this.ctx.body = {
          step: 'getTicket',
          res_code: ticket.errcode,
          res_msg: ticket.errmsg,
        };
      } else {
        this.ctx.body = {
          res_code: 0,
          res_msg: 'success',
          data: {
            ticket: ticket.ticket,
            expires_in: ticket.expires_in,
          },
        };
      }
    }
  }
}

module.exports = WeappController;
