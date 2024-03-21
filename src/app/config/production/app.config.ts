export const APP = {
  LIMIT: 16,
  PORT: 8000,
  ROOT_PATH: __dirname,
  NAME: 'ACD_RD3 WebTeam API Service(prod)',
  URL: '/api/v1/',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  ENVIRONMENT: process.env.NODE_ENV
};

export const Ark = {
  Host: 'http://karasu.jp88jp.com',
  Port: '8080',
  TimeOut: 5000
}

export const MONGODB = {
  host: '127.0.0.1',
  port: '27017'
};

export const GameTower = {
  host: 'https://www.gametower.com.tw',
  game: 'KARASU',
  member_no : '0',
  uni_business: '22',
  lan: 'JP',
  platform: '23'
}