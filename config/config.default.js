'use strict';

module.exports = appInfo => {
  exports.mongoose = {
    url: 'mongodb://127.0.0.1:27017/weapp',
    options: {},
  };
  const config = exports;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1546847924974_9341';

  // add your config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: '*',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return config;
};
