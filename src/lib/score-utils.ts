import {
  Game,
  Player,
  PlayerSeat,
  RoundAdjustment,
  TablePosition,
} from "@/types/game";

export function getCurrentScores(game: Game): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const player of game.players) {
    scores[player.id] = game.startingScore;
  }

  for (const round of game.rounds) {
    for (const adjustment of round.adjustments) {
      scores[adjustment.playerId] += adjustment.delta;
    }
  }

  // Live UI preview for the current in-progress hand
  for (const player of game.players) {
    if (player.isRiichi) {
      scores[player.id] -= 1000;
    }
  }

  return scores;
}

export function getRiichiPool(game: Game): number {
  // Live riichi pool for the current in-progress hand only
  return game.players.filter((player) => player.isRiichi).length * 1000;
}

export function getPlayerByTablePosition(
  game: Game,
  position: TablePosition
): Player | undefined {
  return game.players.find(
    (player) => game.playerPositions[player.id] === position
  );
}

export function rotateSeatsAntiClockwise(players: Player[]): Player[] {
  const nextSeatMap: Record<PlayerSeat, PlayerSeat> = {
    east: "north",
    north: "west",
    west: "south",
    south: "east",
  };

  return players.map((player) => ({
    ...player,
    seat: nextSeatMap[player.seat],
  }));
}

function emptyAdjustments(game: Game): Record<string, number> {
  return Object.fromEntries(game.players.map((player) => [player.id, 0]));
}

export function buildRonAdjustments(
  game: Game,
  winnerPlayerId: string,
  discarderPlayerId: string,
  enteredValue: number
): RoundAdjustment[] {
  const pool = getRiichiPool(game);
  const deltas = emptyAdjustments(game);

  deltas[winnerPlayerId] += enteredValue + pool;
  deltas[discarderPlayerId] -= enteredValue;

  return game.players.map((player) => ({
    playerId: player.id,
    delta: deltas[player.id],
  }));
}

export function buildTsumoAdjustments(
  game: Game,
  winnerPlayerId: string,
  enteredValue: number
): RoundAdjustment[] {
  const winner = game.players.find((player) => player.id === winnerPlayerId);
  if (!winner) {
    throw new Error("Winner not found.");
  }

  const pool = getRiichiPool(game);
  const deltas = emptyAdjustments(game);

  if (winner.seat === "east") {
    if (enteredValue % 3 !== 0) {
      throw new Error("Dealer tsumo value must split evenly across 3 players.");
    }

    const eachPays = enteredValue / 3;

    for (const player of game.players) {
      if (player.id === winnerPlayerId) continue;
      deltas[player.id] -= eachPays;
    }

    deltas[winnerPlayerId] += enteredValue + pool;
  } else {
    if (enteredValue % 4 !== 0) {
      throw new Error("Non-dealer tsumo value must support a 2x/1x/1x split.");
    }

    const nonDealerPay = enteredValue / 4;
    const dealerPay = nonDealerPay * 2;

    for (const player of game.players) {
      if (player.id === winnerPlayerId) continue;

      if (player.seat === "east") {
        deltas[player.id] -= dealerPay;
      } else {
        deltas[player.id] -= nonDealerPay;
      }
    }

    deltas[winnerPlayerId] += enteredValue + pool;
  }

  return game.players.map((player) => ({
    playerId: player.id,
    delta: deltas[player.id],
  }));
}