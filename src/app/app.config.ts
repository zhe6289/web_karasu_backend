import * as config_development from './config/development/app.config'
import * as config_test from './config/test/app.config'
import * as config_stage from './config/stage/app.config'
import * as config_production from './config/production/app.config'

let config = Object()
switch(process.env.NODE_ENV){
  case "development":
    config = config_development
    break
  case "test":
    config = config_test
    break
  case "stage":
    config = config_stage
    break
  case "production":
    config = config_production
    break
  default:
    config = config_development
    break
}

export const APP = config.APP
export const Ark = config.Ark
export const MONGODB = config.MONGODB
export const i17Service = config.i17Service
export const GameTower = config.GameTower