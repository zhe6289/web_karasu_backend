/**
 * @export
 * @interface IConnectOptions
 */
export interface IConnectOptions {
  loggerLevel?: string;
  keepAlive?: boolean;
  useNewUrlParser?: boolean;
  bufferMaxEntries?: number;
  poolSize?: number;
  useUnifiedTopology?: boolean;
}
