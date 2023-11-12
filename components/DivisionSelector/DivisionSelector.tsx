import { Combobox, Input, InputBase, useCombobox } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

const divisions = ["Men's 1", "Men's 2", "Women's 1", "Women's 2", 'Development 1'];

interface DivisionSelectorProps {
  division: string;
  setDivision: Dispatch<SetStateAction<string>>;
}

export function DivisionSelector({ division, setDivision }: DivisionSelectorProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const options = divisions.map((d) => (
    <Combobox.Option value={d} key={d}>
      {d}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setDivision(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label="Division"
          component="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
        >
          {division || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
