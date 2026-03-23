// export type Ruleset = "riichi" | "hong-kong" | "taiwanese" | "manual";

// export type PlayerSeat = "east" | "south" | "west" | "north";
// export type TablePosition = "top" | "left" | "bottom" | "right";

// export type Player = {
//   id: string;
//   name: string;
//   seat: PlayerSeat;
//   isRiichi: boolean;
// };

// export type RoundAdjustment = {
//   playerId: string;
//   delta: number;
// };

// export type RoundRecord = {
//   id: string;
//   roundNumber: number;
//   adjustments: RoundAdjustment[];
//   note?: string;
//   createdAt: string;
//   resultType?: "ron" | "tsumo" | "manual";
// };

// export type GameStatus = "active" | "finished";

// export type Game = {
//   id: string;
//   name?: string;
//   ruleset: Ruleset;
//   startingScore: number;
//   status: GameStatus;
//   createdAt: string;
//   updatedAt: string;
//   players: Player[];
//   rounds: RoundRecord[];
//   playerPositions: Record<string, TablePosition>;
//   riichiPool: number;
// };

// export type AppSettings = {
//   defaultRuleset: Ruleset;
//   defaultStartingScore: number;
// };

export type Ruleset = "riichi" | "hong-kong" | "taiwanese" | "manual";

export type PlayerSeat = "east" | "south" | "west" | "north";
export type TablePosition = "top" | "left" | "bottom" | "right";
export type RoundType = "ron" | "tsumo" | "manual";

export type Player = {
  id: string;
  name: string;
  seat: PlayerSeat;
  isRiichi: boolean;
};

export type RoundAdjustment = {
  playerId: string;
  delta: number;
};

export type RoundRecord = {
  id: string;
  roundNumber: number;
  type: RoundType;
  adjustments: RoundAdjustment[];
  note?: string;
  createdAt: string;
  riichiPoolAwarded?: number;
  winnerPlayerId?: string;
  discarderPlayerId?: string;
  enteredValue?: number;
};

export type GameStatus = "active" | "finished";

export type Game = {
  id: string;
  name?: string;
  ruleset: Ruleset;
  startingScore: number;
  createdAt: string;
  updatedAt: string;
  status: GameStatus;
  players: Player[];
  rounds: RoundRecord[];
  playerPositions: Record<string, TablePosition>;
};

export type AppSettings = {
  defaultRuleset: Ruleset;
  defaultStartingScore: number;
};