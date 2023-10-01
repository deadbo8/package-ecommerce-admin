"use client";

import { Check, ChevronsUpDownIcon, PlusCircle, Store as StoreIcon } from "lucide-react";
import { store } from "@prisma/client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>

interface StoreSwictherProps extends PopoverTriggerProps {
    items : store[];
}

export default function StoreSwicther({
    className,
    items = []
}:StoreSwictherProps){

    const StoreModal= useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore= formattedItems.find((items) => items.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store :{value: string, lablel: string})=>{
        setOpen(false);
        router.push(`/${store.value}`)
    }

    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}            
                >
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search Store..."/>
                        <CommandEmpty>No store found.</CommandEmpty>
                            <CommandGroup heading="Stores">
                                {formattedItems.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        onSelect={()=> onStoreSelect(store)}
                                        className="test-sm"
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4"/>
                                        {store.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentStore?.value === store.value
                                                ?"opacity-100"
                                                :"opacity-0"
                                            )}
                                        />

                                    </CommandItem>
                                ))}
                            </CommandGroup> 
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={()=>{
                                    setOpen(false);
                                    StoreModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-5 w-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>

        </Popover>
    )
}