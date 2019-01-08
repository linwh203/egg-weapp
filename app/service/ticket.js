'use strict';
const Service = require('egg').Service;

const appid = 'wx6aae799fac854bd0';
const secret = '5ceea40d33351e675483aaa1ea08839a';
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

class TicketService extends Service {
  async getTicket() {
    const data = await this.ctx.model.Ticket.findOne({
      name: 'access_token',
    }).exec();
    if (!this.isValid(data)) {
      const newData = await this.fetchTicket();
      await this.saveTicket(newData);
      return newData;
      /* eslint-disable */
    } else {
      return data;
      /* eslint-enable */
    }
  }
  async saveTicket(ticket) {
    const Ticket = this.ctx.model.Ticket;
    let token = await Ticket.findOne({
      name: 'access_token',
    }).exec();
    if (token) {
      token.access_token = ticket.access_token;
      token.expires_in = ticket.expires_in;
    } else {
      token = new Ticket({
        name: 'access_token',
        access_token: ticket.access_token,
        expires_in: ticket.expires_in,
      });
    }
    token.save(ticket);
  }
  async updateTicket(ticket) {
    this.ctx.model.Ticket.update(ticket);
  }
  async fetchTicket() {
    try {
      const data = await this.ctx.curl(url, {
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,
      });
      const ticket = data.data;
      const now = (new Date().getTime());
      const expiresIn = now + (ticket.expires_in + 20) * 1000;// 20秒缓冲期
      ticket.expires_in = expiresIn;

      return ticket;
    } catch (error) {
      console.log(error);
    }
  }

  isValid(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }
    const expiresIn = data.expires_in;
    const now = (new Date().getTime());
    if (now < expiresIn) {
      return true;
      /* eslint-disable */
    } else {
      return false;
      /* eslint-enable */
    }
  }
}
module.exports = TicketService;
