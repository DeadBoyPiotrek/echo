import * as Popover from '@radix-ui/react-popover';

export const PopoverMenu = () => (
  <Popover.Root>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Anchor />
    <Popover.Portal>
      <Popover.Content>
        hello
        <Popover.Close />
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
