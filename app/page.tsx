'use client';

import { Title, Button, Text, Space, Group, Container } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconClock } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Player } from '@/models/Player';
import { TeamGrid } from '@/components/TeamGrid/TeamGrid';
import { DivisionSelector } from '@/components/DivisionSelector/DivisionSelector';
import { GameScore } from '@/components/GameScore/GameScore';
import { GameContent } from '@/components/GameContent/GameContent';

export default function HomePage() {
  const [division, setDivision] = useState('');
  const [teamAName, setTeamAName] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState<Array<Player>>([]);

  const [teamBName, setTeamBName] = useState('');
  const [teamBPlayers, setTeamBPlayers] = useState<Array<Player>>([]);

  const [startGameDisabled, setStartGameDisabled] = useState<boolean>(true);
  const [gameStartTime, setGameStartTime] = useState<DateTime | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(20.0 * 60); // Default to 20 minutes, in seconds.
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [timeout, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameStartTime && clockRunning && timeRemaining > 0) {
      setTimeoutRef(setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000));
    }
  }, [gameStartTime, clockRunning, timeRemaining]);

  useEffect(() => {
    // TODO: Highlight where the error is.
    // TODO: Temporarily disabled.
    // const hasGameStarted = gameStartTime !== null;
    // const isDivisionSet = division.length > 0;
    // const isTeamANameSet = teamAName.length > 0;
    // const isTeamBNameSet = teamBName.length > 0;
    // const teamAMinPlayers = teamAPlayers.length >= 6; // 5 field + 1 goal
    // const teamBMinPlayers = teamBPlayers.length >= 6; // 5 field + 1 goal
    // setStartGameDisabled(
    //   hasGameStarted ||
    //     !isDivisionSet ||
    //     !isTeamANameSet ||
    //     !isTeamBNameSet ||
    //     !teamAMinPlayers ||
    //     !teamBMinPlayers
    // );
    setStartGameDisabled(false);
  }, [gameStartTime, division, teamAName, teamBName, teamAPlayers, teamBPlayers]);

  function getPreGameContent(): JSX.Element {
    return (
      <>
        <DivisionSelector division={division} setDivision={setDivision} />
        <TeamGrid
          teamName={teamAName}
          setTeamName={setTeamAName}
          players={teamAPlayers}
          setPlayers={setTeamAPlayers}
        />
        <Space h="md" />
        <TeamGrid
          teamName={teamBName}
          setTeamName={setTeamBName}
          players={teamBPlayers}
          setPlayers={setTeamBPlayers}
        />
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
            disabled={startGameDisabled}
          >
            Start Game
          </Button>
          <Text>{gameStartTime?.toLocaleString(DateTime.DATETIME_MED) ?? ''}</Text>
        </Group>
      </>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container p="sm">
        <Group justify="center">
          <Title order={1}>Match Minder Pro</Title>
        </Group>
        <GameScore teamAPlayers={teamAPlayers} teamBPlayers={teamBPlayers} />
        {gameStartTime === null ? (
          getPreGameContent()
        ) : (
          <GameContent
            clockRunning={clockRunning}
            setClockRunning={setClockRunning}
            timeout={timeout}
            gameStartTime={gameStartTime}
            timeRemaining={timeRemaining}
            teamAName={teamAName}
            teamBName={teamBName}
            teamAPlayers={teamAPlayers}
            teamBPlayers={teamBPlayers}
            setTeamAPlayers={setTeamAPlayers}
            setTeamBPlayers={setTeamAPlayers}
          />
        )}
      </Container>
    </main>
  );
}
