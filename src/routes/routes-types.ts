export interface IAddGameResult {
  body: IGameResultBody;
}

export interface IGameResultBody {
  winner: string;
  loser: string;
  result: string;
}

export interface IUpdateResultById {
  params: { id: string };
  body: IGameResultBody;
}

export interface ICreateAccountBody {
  email: string;
  password: string;
  phone?: number;
}
