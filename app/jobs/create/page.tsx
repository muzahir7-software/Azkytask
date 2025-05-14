"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from "../../../components/ui/checkbox";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  remote: z.boolean().default(false),
  files: z.array(z.instanceof(File)).min(1, { message: "Please upload at least one file." }), // Make files required
});

import { Candidate } from '../../../lib/types'; // Import Candidate type from shared types

const realNames = [
  "Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy",
  "Kevin", "Linda", "Michael", "Nancy", "Oscar", "Penny", "Quentin", "Ruth", "Steve", "Tina",
  "Uma", "Victor", "Wendy", "Xavier", "Yvonne", "Zack"
];

const CreateJobPage = () => {
  const router = useRouter();
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      remote: false,
      files: [], // Initialize files as an empty array
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Form values", values);

    // Generate dummy candidate data based on the number of uploaded files
    const newDummyCandidates = values.files.map((file, index) => {
      const randomName = realNames[Math.floor(Math.random() * realNames.length)];
      return {
        id: `dummy-${index}-${Date.now()}`,
        name: randomName,
        age: Math.floor(Math.random() * 40) + 20,
        email: `${randomName.toLowerCase().replace(/\s/g, '')}${index + 1}@example.com`,
        jobTitle: values.jobTitle,
        aiScore: Math.floor(Math.random() * 101),
        status: "processing", // Set initial status to "processing"
      };
    });

    // Read existing processing data from local storage
    const existingProcessingCandidatesString = localStorage.getItem('processingCandidates');
    let existingProcessingCandidates: any[] = [];
    if (existingProcessingCandidatesString) {
      try {
        existingProcessingCandidates = JSON.parse(existingProcessingCandidatesString);
      } catch (error) {
        console.error("Error parsing existing processing data from local storage:", error);
        existingProcessingCandidates = [];
      }
    }

    // Combine existing and new processing candidates
    const updatedProcessingCandidates = [...existingProcessingCandidates, ...newDummyCandidates];

    // Store the combined processing data in local storage
    localStorage.setItem('processingCandidates', JSON.stringify(updatedProcessingCandidates));

    router.push("/jobs/processing");
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter job title" {...field} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter job description" {...field} className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remote"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border shadow-sm p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Remote</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Is this a remote job?
                  </p>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Add file input field */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Files</FormLabel> {/* Updated label */}
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Submit Job</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobPage;