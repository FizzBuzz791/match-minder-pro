import { ActionIcon, Button, Group, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconClockPause, IconPlus } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction } from 'react';
import { Player } from '@/models/Player';
import { AddGoalForm } from '../AddGoalForm/AddGoalForm';

function displaySecondsAsTime(seconds: number): string {
  const minutesPart = Math.trunc(seconds / 60);
  const secondsPart = seconds - minutesPart * 60;
  return `${minutesPart}:${secondsPart >= 10 ? secondsPart : `0${secondsPart}`}`;
}

interface GameContentProps {
  clockRunning: boolean;
  setClockRunning: Dispatch<SetStateAction<boolean>>;
  timeout: NodeJS.Timeout | null;
  gameStartTime: DateTime | null;
  timeRemaining: number;
  teamAName: string;
  teamBName: string;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  setTeamAPlayers: Dispatch<SetStateAction<Player[]>>;
  setTeamBPlayers: Dispatch<SetStateAction<Player[]>>;
}

export function GameContent({
  clockRunning,
  setClockRunning,
  timeout,
  gameStartTime,
  timeRemaining,
  teamAName,
  teamBName,
  teamAPlayers,
  teamBPlayers,
  setTeamAPlayers,
  setTeamBPlayers,
}: GameContentProps) {
  const [teamAGoalFormOpened, { open: openTeamAGoalForm, close: closeTeamAGoalForm }] =
    useDisclosure(false);
  const [teamBGoalFormOpened, { open: openTeamBGoalForm, close: closeTeamBGoalForm }] =
    useDisclosure(false);

  return (
    <>
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
          disabled={gameStartTime === null}
        >
          {clockRunning ? 'Pause' : 'Resume'}
        </Button>
        <Text>Time Remaining: {displaySecondsAsTime(timeRemaining)}</Text>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Goal</Table.Th>
            <Table.Th>Penalty</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>{teamAName}</Table.Th>
            <Table.Th>
              <ActionIcon
                aria-label={`Add Goal for ${teamAName}`}
                onClick={() => {
                  openTeamAGoalForm();
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Table.Th>
            <Table.Th>
              <ActionIcon>
                <IconPlus />
              </ActionIcon>
            </Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>{teamBName}</Table.Th>
            <Table.Th>
              <ActionIcon
                aria-label={`Add Goal for ${teamBName}`}
                onClick={() => {
                  openTeamBGoalForm();
                }}
              >
                <IconPlus />
              </ActionIcon>
            </Table.Th>
            <Table.Th>
              <ActionIcon>
                <IconPlus />
              </ActionIcon>
            </Table.Th>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      {teamAPlayers
        .filter((p) => p.goals.length > 0)
        .flatMap((p) => p.goals)
        .map((g, i) => (
          <Text>
            Goal {i}: {g.toISOTime()}
          </Text>
        ))}
      <AddGoalForm
        opened={teamAGoalFormOpened}
        close={closeTeamAGoalForm}
        teamName={teamAName}
        players={teamAPlayers}
        setPlayers={setTeamAPlayers}
      />
      <AddGoalForm
        opened={teamBGoalFormOpened}
        close={closeTeamBGoalForm}
        teamName={teamBName}
        players={teamBPlayers}
        setPlayers={setTeamBPlayers}
      />
    </>
  );
}
