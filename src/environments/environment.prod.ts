declare var require: any;

export const environment = {
  production: true,
  envName: 'prod',
  WEB_SERVICE_HOST: 'https://jopebot.com',
  VERSION: require('../../package.json').version
};
