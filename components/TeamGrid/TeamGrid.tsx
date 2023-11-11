import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Table,
  TextInput,
  Checkbox,
  NumberInput,
} from '@mantine/core';
import { IconAward, IconHelmet, IconPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Dispatch, SetStateAction } from 'react';
import { Player } from '@/models/Player';

function getIcon(player: Player): JSX.Element | null {
  if (player.goalkeeper) {
    return <IconHelmet />;
  }
  if (player.captain) {
    return <IconAward />;
  }
  return null;
}

export interface TeamGridProps {
  players: Array<Player>;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
}

export function TeamGrid({ players, setPlayers }: TeamGridProps) {
  const addPlayerForm = useForm({
    initialValues: {
      name: '',
      goalkeeper: false,
      captain: false,
      number: 1,
    },
    validate: {
      name: (value) => (value !== '' ? null : 'Invalid name'),
      number: (value, { goalkeeper }) =>
        !goalkeeper && value === 1 ? '1 is reserved for Goalkeepers' : null,
    },
  });
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th colSpan={3}>
              <ActionIcon variant="filled" aria-label="Add Player" onClick={open}>
                <IconPlus />
              </ActionIcon>
            </Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th w="0.1vw">G/C</Table.Th>
            <Table.Th w="0.1vw">No</Table.Th>
            <Table.Th>Player</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {players.map((p) => (
            <Table.Tr key={p.name}>
              <Table.Td>{getIcon(p)}</Table.Td>
              <Table.Td>{p.number}</Table.Td>
              <Table.Td>{p.name}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Add Player">
        <form
          onSubmit={addPlayerForm.onSubmit((values) => {
            close();
            addPlayerForm.reset();
            return setPlayers([
              ...players,
              {
                name: values.name,
                goalkeeper: values.goalkeeper,
                captain: values.captain,
                number: values.number,
              },
            ]);
          })}
        >
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Firstname Lastname"
            {...addPlayerForm.getInputProps('name')}
          />
          <NumberInput min={1} max={99} {...addPlayerForm.getInputProps('number')} />
          <Checkbox label="Goalkeeper" {...addPlayerForm.getInputProps('goalkeeper')} />
          <Checkbox label="Captain" {...addPlayerForm.getInputProps('captain')} />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
