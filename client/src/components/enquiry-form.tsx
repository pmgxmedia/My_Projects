import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createEnquiry } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  type: z.enum(["similar", "license", "custom"]),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export function EnquiryForm({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const mutation = useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Enquiry Sent",
        description: `We've received your request regarding project ${projectId}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "similar",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      ...values,
      projectId,
    });
  }

  if (submitted) {
    return (
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardContent className="pt-6 flex flex-col items-center text-center py-12">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">Request Received</h3>
          <p className="text-muted-foreground max-w-xs mb-6">
            Thank you for your interest. I will review your enquiry regarding this digital asset and respond within 24 hours.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Request</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-white/5">
      <CardHeader>
        <CardTitle className="font-display">Interested in this Solution?</CardTitle>
        <CardDescription>
          Directly enquire about this project asset.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Type</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {["similar", "license", "custom"].map((type) => (
                      <div
                        key={type}
                        className={`cursor-pointer text-xs font-medium text-center py-2 rounded border transition-colors ${
                          field.value === type
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background border-input hover:border-primary/50 text-muted-foreground"
                        }`}
                        onClick={() => field.onChange(type)}
                      >
                        {type === "similar" && "Build Similar"}
                        {type === "license" && "License Code"}
                        {type === "custom" && "Customize"}
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="I'm interested in how this architecture handles..." 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending..." : "Send Enquiry"} <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
