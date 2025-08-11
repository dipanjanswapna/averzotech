
"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
       <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category.name} className="border-none">
          <AccordionTrigger className="py-2.5 font-semibold text-base hover:no-underline">
             <Link href={category.href} className='flex-1 text-left'>{category.name}</Link>
          </AccordionTrigger>
          <AccordionContent className="pl-4">
              <Accordion type="multiple" collapsible className="w-full">
                {category.subCategories.map((group: any) => (
                    <AccordionItem value={group.group} key={group.group} className="border-none">
                        <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
                            {group.group}
                        </AccordionTrigger>
                         <AccordionContent className="pl-4">
                            <div className="flex flex-col space-y-2">
                            {group.items.map((sub: string) => (
                                <Link key={sub} href="#" className="text-muted-foreground hover:text-foreground text-sm py-1.5">
                                  {sub}
                                </Link>
                              ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
