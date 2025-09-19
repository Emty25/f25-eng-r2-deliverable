"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>{species.common_name}</DialogDescription>
        </DialogHeader>
        <p className="mt-2">Kingdom: {species.kingdom}</p>
        <p className="mt">Population: {species.total_population}</p>
        <p className="mt-4">{species.description}</p>
        <DialogClose asChild>
          <Button className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
