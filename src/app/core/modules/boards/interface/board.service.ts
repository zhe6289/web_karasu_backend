import { IBoard } from './board.interface';

export interface IBoardService {
  findall(): Promise<IBoard[]>;
  findEach(query: object): Promise<IBoard>;
}
