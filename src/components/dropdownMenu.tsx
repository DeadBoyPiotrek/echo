import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <DropdownMenuPrimitive.Root>
    <DropdownMenuPrimitive.Trigger asChild>
      <button className="absolute right-24 top-20">
        <HamburgerMenuIcon className="w-6 h-6" />
      </button>
    </DropdownMenuPrimitive.Trigger>

    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content className=" p-3 border rounded-md">
        {children}
        <DropdownMenuPrimitive.Arrow className="fill-white" />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  </DropdownMenuPrimitive.Root>
);

export const DropdownMenuItem = DropdownMenuPrimitive.Item;
