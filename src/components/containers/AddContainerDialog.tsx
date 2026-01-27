import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { dummyShippingLines, dummyCustomers } from '@/data/dummyData';
import type { ContainerSize, ContainerType, MovementType, ContainerStatus } from '@/types';

const containerSchema = z.object({
  containerNumber: z
    .string()
    .min(11, 'Container number must be at least 11 characters')
    .max(11, 'Container number must be exactly 11 characters')
    .regex(/^[A-Z]{4}\d{7}$/, 'Format: 4 letters + 7 digits (e.g., MSCU1234567)'),
  size: z.enum(['20ft', '40ft', '45ft'] as const),
  type: z.enum(['standard', 'reefer', 'tank', 'open-top', 'flat-rack'] as const),
  movementType: z.enum(['import', 'export', 'domestic'] as const),
  status: z.enum(['pending', 'in-yard', 'in-transit', 'at-port', 'at-factory', 'gate-in', 'gate-out', 'damaged'] as const),
  shippingLine: z.string().min(1, 'Shipping line is required'),
  customer: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),
  sealNumber: z.string().optional(),
});

type ContainerFormData = z.infer<typeof containerSchema>;

interface AddContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ContainerFormData) => void;
}

export function AddContainerDialog({ open, onOpenChange, onSubmit }: AddContainerDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContainerFormData>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      containerNumber: '',
      size: '40ft',
      type: 'standard',
      movementType: 'import',
      status: 'pending',
      shippingLine: '',
      customer: '',
      weight: undefined,
      sealNumber: '',
    },
  });

  const handleSubmit = async (data: ContainerFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSubmit?.(data);
      toast({
        title: 'Container Added',
        description: `Container ${data.containerNumber} has been added successfully.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add container. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Container</DialogTitle>
          <DialogDescription>
            Enter the container details below. All required fields are marked.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="containerNumber"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Container Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MSCU1234567"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="20ft">20ft</SelectItem>
                        <SelectItem value="40ft">40ft</SelectItem>
                        <SelectItem value="45ft">45ft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="reefer">Reefer</SelectItem>
                        <SelectItem value="tank">Tank</SelectItem>
                        <SelectItem value="open-top">Open Top</SelectItem>
                        <SelectItem value="flat-rack">Flat Rack</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="movementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select movement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="import">Import</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="domestic">Domestic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="gate-in">Gate In</SelectItem>
                        <SelectItem value="in-yard">In Yard</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="at-port">At Port</SelectItem>
                        <SelectItem value="at-factory">At Factory</SelectItem>
                        <SelectItem value="gate-out">Gate Out</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Line *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping line" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dummyShippingLines.map((line) => (
                          <SelectItem key={line.id} value={line.name}>
                            {line.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {dummyCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 25000"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sealNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seal Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SEAL123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Container'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
