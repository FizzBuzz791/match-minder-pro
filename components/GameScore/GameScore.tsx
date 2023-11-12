import { Group, Title } from '@mantine/core';
import { Player } from '@/models/Player';

interface GameScoreProps {
  teamAPlayers: Player[];
  teamBPlayers: Player[];
}

function getTeamScore(players: Player[]): number {
  return players.reduce((acc, cur) => acc + cur.goals, 0);
}

export function GameScore({ teamAPlayers, teamBPlayers }: GameScoreProps) {
  return (
    <Group justify="center">
      <Title order={2}>
        Score: {getTeamScore(teamAPlayers)} - {getTeamScore(teamBPlayers)}
      </Title>
    </Group>
  );
}
