'use strict';

const Controller = require('egg').Controller;

class WeappController extends Controller {
  async ticket() {
    const ctx = this.ctx;
    // const appid = 'wx6aae799fac854bd0';
    // const secret = '5ceea40d33351e675483aaa1ea08839a';
    // const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    // const reqData = await ctx.curl(url, {
    //   // 自动解析 JSON response
    //   dataType: 'json',
    //   // 3 秒超时
    //   timeout: 3000,
    // });
    // const accessData = reqData.data;
    // if (accessData.errcode) {
    //   this.ctx.body = {
    //     res_code: accessData.errcode,
    //     res_msg: accessData.errmsg,
    //   };
    // } else {
    //   this.ctx.body = {
    //     res_code: 0,
    //     res_msg: 'success',
    //     data: {
    //       ticket: accessData.access_token,
    //       expires_in: accessData.expires_in,
    //     },
    //   };
    // }
    this.ctx.body = await this.ctx.model.Ticket.find({});
  }
}

module.exports = WeappController;
