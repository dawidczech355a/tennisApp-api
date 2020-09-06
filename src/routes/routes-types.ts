export interface IAddGameResult {
  body: IGameResultBody;
}

export interface IGameResultBody {
  winner: string;
  loser: string;
  result: string;
}

export interface IParams {
  id?: string;
}

export interface IUpdateResultById {
  params: IParams;
  body: IGameResultBody;
}

export interface ICreateAccountBody {
  email: string;
  password: string;
  phone?: number;
}

export interface IAuthData {
  name: string;
}

export interface IJwtAuthData {
  email: string;
}
