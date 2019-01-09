'use strict';
const Service = require('egg').Service;

const appid = 'wx6aae799fac854bd0';
const secret = '5ceea40d33351e675483aaa1ea08839a';
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

class TokenService extends Service {
  async getToken() {
    const data = await this.ctx.model.Token.findOne({
      name: 'access_token',
    }).exec();
    if (!this.isValid(data)) {
      const newData = await this.fetchToken();
      if (newData.errcode) {
        return newData;
      }
      await this.saveToken(newData);
      return newData;
      /* eslint-disable */
    } else {
      return data;
      /* eslint-enable */
    }
  }
  async saveToken(data) {
    const Token = this.ctx.model.Token;
    let token = await Token.findOne({
      name: 'access_token',
    }).exec();
    if (token) {
      token.access_token = data.access_token;
      token.expires_in = data.expires_in;
    } else {
      token = new Token({
        name: 'access_token',
        access_token: data.access_token,
        expires_in: data.expires_in,
      });
    }
    token.save(data);
  }
  async fetchToken() {
    try {
      const data = await this.ctx.curl(url, {
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,
      });
      const token = data.data;
      if (token.errcode) {
        return token;
      }
      const now = (new Date().getTime());
      const expiresIn = now + (token.expires_in + 20) * 1000;// 20秒缓冲期
      token.expires_in = expiresIn;

      return token;
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
module.exports = TokenService;
