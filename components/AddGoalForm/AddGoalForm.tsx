import { Button, Combobox, Group, Input, InputBase, Modal, useCombobox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateTime } from 'luxon';
import { Dispatch, SetStateAction, useState } from 'react';
import { Player } from '@/models/Player';

interface AddGoalForm {
  opened: boolean;
  close: () => void;
  teamName: string;
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
}

export function AddGoalForm({ teamName, opened, close, players, setPlayers }: AddGoalForm) {
  const addGoalForm = useForm<{ goalPlayer: Player | null; assistPlayer: Player | null }>({
    initialValues: {
      goalPlayer: null,
      assistPlayer: null,
    },
  });
  const goalScorerCombobox = useCombobox({
    onDropdownClose: () => goalScorerCombobox.resetSelectedOption(),
  });
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const options = players.map((p) => (
    <Combobox.Option value={p.name} key={p.name}>
      {`#${p.number ?? '??'} ${p.name}`}
    </Combobox.Option>
  ));

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`Add ${teamName} Goal`}
      closeOnClickOutside={false}
    >
      <form
        onSubmit={(event) => {
          if (selectedGoal === '') {
            event.preventDefault();
          }

          return addGoalForm.onSubmit((values) => {
            close();
            addGoalForm.reset();

            if (values.goalPlayer) {
              const newPlayers = [...players];
              // ! is OK because the form validates that a player is selected.
              const index = newPlayers.findIndex((p) => p.number === values.goalPlayer!.number);
              newPlayers[index].goals.push(DateTime.now()); // TODO: DateTime.now() is wrong. Should be game timer value.
              setPlayers(newPlayers);
            }
          });
        }}
      >
        <Combobox
          store={goalScorerCombobox}
          onOptionSubmit={(val) => {
            setSelectedGoal(val);
            goalScorerCombobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              label="Goalscorer"
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              onClick={() => goalScorerCombobox.toggleDropdown()}
            >
              {selectedGoal || <Input.Placeholder>Pick a player</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
}
