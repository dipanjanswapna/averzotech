
"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import React from 'react';

export function MegaMenu({ category, isMobile = false }: { category: any, isMobile?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setOpen(true);
  };

  const handleClose = () => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="justify-between w-full">
            <Link href={category.href} className='flex-1 text-left'>{category.name}</Link>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={10}>
          {category.subCategories.map((group: any) => (
             <DropdownMenuGroup key={group.group}>
                <DropdownMenuLabel>{group.group}</DropdownMenuLabel>
                {group.items.map((sub: string) => (
                    <DropdownMenuItem key={sub}>
                      <span>{sub}</span>
                    </DropdownMenuItem>
                  ))}
             </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        <Button variant="ghost" className="p-0" asChild>
          <Link href={category.href}>
            {category.name}
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-auto p-4" 
        sideOffset={20} 
        onMouseEnter={handleOpen} 
        onMouseLeave={handleClose}
        align="start"
      >
        <div className="grid grid-flow-col auto-cols-max gap-8">
          {category.subCategories.map((group: any) => (
             <div key={group.group} className="flex flex-col space-y-2">
                <h3 className="font-bold text-primary">{group.group}</h3>
                 {group.items.map((sub: string) => (
                    <Link key={sub} href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {sub}
                    </Link>
                  ))}
             </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
