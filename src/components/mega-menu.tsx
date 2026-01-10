
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
import { SheetClose } from './ui/sheet';

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

  // This logic is for the Sheet-based mobile menu
  if (isMobile) {
    if (!category.subCategories || category.subCategories.length === 0) {
        return (
             <SheetClose asChild>
                <Link href={category.href} className='flex-1 text-left py-2.5 font-semibold text-base'>{category.name}</Link>
            </SheetClose>
        )
    }

    return (
       <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category.name} className="border-none">
          <AccordionTrigger className="py-2.5 font-semibold text-base hover:no-underline">
             {category.name}
          </AccordionTrigger>
          <AccordionContent className="pl-4">
              <Accordion type="multiple" collapsible className="w-full">
                {category.subCategories.map((group: any) => (
                    <AccordionItem value={group.group} key={group.group} className="border-none">
                        <AccordionTrigger className="py-2 text-sm text-muted-foreground hover:no-underline">
                            <SheetClose asChild>
                                <Link href={`/shop?category=${encodeURIComponent(category.name)}&group=${encodeURIComponent(group.group)}`}>
                                    {group.group}
                                </Link>
                            </SheetClose>
                        </AccordionTrigger>
                         <AccordionContent className="pl-4">
                            <div className="flex flex-col space-y-2">
                            {group.items.map((sub: string) => (
                                <SheetClose asChild key={sub}>
                                    <Link href={`/shop?category=${encodeURIComponent(category.name)}&group=${encodeURIComponent(group.group)}&subcategory=${encodeURIComponent(sub)}`} className="text-muted-foreground hover:text-foreground text-sm py-1.5">
                                    {sub}
                                    </Link>
                                </SheetClose>
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

  // This is for the desktop and new mobile horizontal nav
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onMouseEnter={handleOpen} onMouseLeave={handleClose}>
        <Button variant="ghost" className="p-0 flex-shrink-0" asChild>
          <Link href={category.href}>
            {category.name}
          </Link>
        </Button>
      </DropdownMenuTrigger>
      {category.subCategories && category.subCategories.length > 0 && (
          <DropdownMenuContent 
            className="w-auto p-4" 
            sideOffset={15} 
            onMouseEnter={handleOpen} 
            onMouseLeave={handleClose}
            align="start"
          >
            <div className="grid grid-flow-col auto-cols-max gap-8">
              {category.subCategories.map((group: any) => (
                 <div key={group.group} className="flex flex-col space-y-2">
                    <h3 className="font-bold text-primary">
                      <Link href={`/shop?category=${encodeURIComponent(category.name)}&group=${encodeURIComponent(group.group)}`} className="hover:underline">
                        {group.group}
                      </Link>
                    </h3>
                     {group.items.map((sub: string) => (
                        <Link key={sub} href={`/shop?category=${encodeURIComponent(category.name)}&group=${encodeURIComponent(group.group)}&subcategory=${encodeURIComponent(sub)}`} className="text-muted-foreground hover:text-foreground text-sm">
                          {sub}
                        </Link>
                      ))}
                 </div>
              ))}
            </div>
          </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
