export const APP = {
  LIMIT: 16,
  PORT: 8000,
  ROOT_PATH: __dirname,
  NAME: 'ACD_RD3 WebTeam API Service(test)',
  URL: '/api/v1/',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  ENVIRONMENT: process.env.NODE_ENV
};

export const Ark = {
  Host: 'https://karasu-stg.jp88jp.com',
  Port: '443',
  TimeOut: 5000
};

export const MONGODB = {
  host: 'karasu-mongo-001-stg',
  port: '27017'
};

export const GameTower = {
  host: 'https://www-twtest.towergame.com',
  game: 'KARASU_UAT',
  member_no : '0',
  uni_business: '22',
  lan: 'JP',
  platform: '35'
};