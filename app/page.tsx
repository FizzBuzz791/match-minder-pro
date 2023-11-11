'use client';

import { Title, TextInput, Button, Text, Space, Group, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconClock, IconClockPause } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Player } from '@/models/Player';
import { TeamGrid } from '@/components/TeamGrid/TeamGrid';

export default function HomePage() {
  const [teamAName, setTeamAName] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState<Array<Player>>([]);

  const [teamBName, setTeamBName] = useState('');
  const [teamBPlayers, setTeamBPlayers] = useState<Array<Player>>([]);

  const [gameStartTime, setGameStartTime] = useState<DateTime | null>();
  const [timeRemaining, setTimeRemaining] = useState<number>(20.0 * 60); // Default to 20 minutes, in seconds.
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  let timeout: NodeJS.Timeout | null;

  useEffect(() => {
    if (gameStartTime && clockRunning && timeRemaining > 0) {
      timeout = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    }
  }, [gameStartTime, clockRunning, timeRemaining]);

  function displaySecondsAsTime(seconds: number): string {
    const minutesPart = Math.trunc(seconds / 60);
    const secondsPart = seconds - minutesPart * 60;
    return `${minutesPart}:${secondsPart >= 10 ? secondsPart : `0${secondsPart}`}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container p="sm">
        <Title order={1}>Match Minder Pro</Title>
        <TextInput label="Division" />
        <TextInput
          label="Team A"
          value={teamAName}
          onChange={(event) => setTeamAName(event.target.value)}
        />
        <TeamGrid players={teamAPlayers} setPlayers={setTeamAPlayers} />
        <Space h="md" />
        <TextInput
          label="Team B"
          value={teamBName}
          onChange={(event) => setTeamBName(event.target.value)}
        />
        <TeamGrid players={teamBPlayers} setPlayers={setTeamBPlayers} />
        <Space h="md" />
        <Group>
          <Button
            variant="filled"
            aria-label="Start Game!"
            leftSection={<IconClock />}
            onClick={() => {
              setClockRunning(true);
              setGameStartTime(DateTime.now());
            }}
            disabled={!!gameStartTime}
          >
            Start Game
          </Button>
          <Text>{gameStartTime?.toISO() ?? ''}</Text>
        </Group>
        <Space h="md" />
        <Group>
          <Button
            variant="filled"
            aria-label={clockRunning ? 'Pause' : 'Resume'}
            leftSection={<IconClockPause />}
            onClick={() => {
              if (timeout) {
                clearTimeout(timeout);
              }

              setClockRunning(!clockRunning);
            }}
            disabled={gameStartTime == null}
          >
            {clockRunning ? 'Pause' : 'Resume'}
          </Button>
          <Text>Time Remaining: {displaySecondsAsTime(timeRemaining)}</Text>
        </Group>
      </Container>
    </main>
  );
}
