'use strict';
const Service = require('egg').Service;
class TicketService extends Service {
  // 获取所有文章
  async getTicket() {
    // 这里需要注意： 只有安装了 mongoose 后， model 才会挂载到 this.ctx 上。
    return this.ctx.model.Ticket.find().exec();
  }
  // 保存文章
  async saveTicket(ticket) {
    this.ctx.model.Ticket.create(ticket);
  }
}
module.exports = TicketService;
