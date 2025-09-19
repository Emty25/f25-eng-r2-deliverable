"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// Use Zod to define the shape + requirements of a Species entry; used in form validation
const speciesSchema = z.object({
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().min(1).nullable(),
  image: z
    .string()
    .url()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  description: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
});
type FormData = z.infer<typeof speciesSchema>;
export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const defaultValues: Partial<FormData> = {
    scientific_name: species.scientific_name,
    common_name: species.common_name,
    kingdom: species.kingdom,
    total_population: species.total_population,
    image: species.image,
    description: species.description,
  };
  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });
  const onSubmit = async (data: FormData) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("species").update(data).eq("id", species.id);

    // Catch and report errors from Supabase and exit the onSubmit function with an early 'return' if an error occurred.
    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }
    form.reset(data);
    router.refresh();
    return toast({
      title: "Species updated successfully!",
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icons.add className="mr-2 h-5 w-5" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Cavia porcellus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="common_name"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Common Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Guinea pig" value={value ?? ""} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="kingdom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kingdom</FormLabel>
                  <Select onValueChange={(val) => field.onChange(kingdoms.parse(val))} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select kingdom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {kingdoms.options.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_population"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Total Population</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="300000"
                        value={value ?? ""}
                        {...rest}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" value={value ?? ""} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Species description" value={value ?? ""} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="mt-4 flex gap-2">
              <Button type="submit" className="flex-1">
                Save
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
