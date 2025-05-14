"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Candidate } from "@/lib/types";

interface ProcessingCandidate extends Candidate {
  status: "processing" | "error" | "completed";
  errorMessage?: string;
}
const columns: ColumnDef<ProcessingCandidate>[] = [
    {
    accessorKey: "name",
    header: "Candidate Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "errorMessage",
    header: "Error Message",
    cell: ({ row }) => row.original.errorMessage || "-",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
   {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
   {
    accessorKey: "aiScore",
    header: "AI Score",
  },
];

const ProcessingPage = () => {
  const [data, setData] = React.useState<ProcessingCandidate[]>([]);

  React.useEffect(() => {
    // Load processing data from local storage
    const storedProcessingCandidates = localStorage.getItem('processingCandidates');
    if (storedProcessingCandidates) {
      try {
        const parsedCandidates = JSON.parse(storedProcessingCandidates) as ProcessingCandidate[];
        setData(parsedCandidates);

        // Update status to "completed" after 5 seconds
        setTimeout(() => {
          const updatedCandidates = parsedCandidates.map(candidate => ({
            ...candidate,
            status: "completed",
          }));

          // Move completed candidates to results table
          const existingCandidatesString = localStorage.getItem('candidateResults');
          let existingCandidates: any[] = [];
          if (existingCandidatesString) {
            try {
              existingCandidates = JSON.parse(existingCandidatesString);
            } catch (error) {
              console.error("Error parsing existing candidate data from local storage:", error);
              existingCandidates = [];
            }
          }

          const updatedCandidatesResults = [...existingCandidates, ...updatedCandidates];
          localStorage.setItem('candidateResults', JSON.stringify(updatedCandidatesResults));

          // Remove processing candidates from local storage
          localStorage.removeItem('processingCandidates');
          setData([]); // Clear processing data

        }, 5000); // 5 seconds
      } catch (error) {
        console.error("Error parsing processing data from local storage:", error);
      }
    }
  }, []);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Processing</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProcessingPage;