'use strict';
const Service = require('egg').Service;

const api = {
  js_ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
};

class TicketService extends Service {
  async getTicket(token) {
    const data = await this.ctx.model.Ticket.findOne({
      name: 'js_ticket',
    }).exec();
    if (!this.isValid(data)) {
      const newData = await this.fetchTicket(token);
      await this.saveTicket(newData);
      return newData;
      /* eslint-disable */
    } else {
      return data;
      /* eslint-enable */
    }
  }
  async saveTicket(data) {
    const Ticket = this.ctx.model.Ticket;
    let info = await Ticket.findOne({
      name: 'js_ticket',
    }).exec();
    if (info) {
      info.ticket = data.ticket;
      info.expires_in = data.expires_in;
    } else {
      info = new Ticket({
        name: 'js_ticket',
        ticket: data.ticket,
        expires_in: data.expires_in,
      });
    }
    info.save(data);
  }
  async fetchTicket(token) {
    const url = `${api.js_ticket}?access_token=${token}&type=jsapi`;
    try {
      const data = await this.ctx.curl(url, {
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,
      });
      const info = data.data;
      const now = (new Date().getTime());
      const expiresIn = now + (info.expires_in + 20) * 1000;// 20秒缓冲期
      info.expires_in = expiresIn;

      return info;
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
