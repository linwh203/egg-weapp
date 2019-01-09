'use strict';
const Service = require('egg').Service;
const sha1 = require('sha1');

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

  sign(ticket, url) {
    const noncestr = createNonce();
    const timestamp = createTimestamp();
    const signature = signIt(noncestr, ticket, timestamp, url);
    return {
      noncestr,
      timestamp,
      signature,
    };

    function signIt(noncestr, ticket, timestamp, url) {
      const ret = {
        jsapi_ticket: ticket,
        nonceStr: noncestr,
        timestamp,
        url,
      };
      const string = raw(ret);
      const sha = sha1(string);
      return sha;
    }
    function createNonce() {
      return Math.random().toString(36).substr(2, 15);
    }
    function createTimestamp() {
      return parseInt(new Date().getTime() / 1000, 0) + '';
    }
    function raw(args) {
      let keys = Object.keys(args);
      let newArgs = {};
      let str = '';
      keys = keys.sort();
      keys.forEach(key => {
        newArgs[key.toLowerCase()] = args[key];
      });
      for (let k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
      }
      return str.substr(1);
    }
  }
}
module.exports = TicketService;
