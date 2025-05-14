"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table, // Import Table type
  Row, // Import Row type
} from "@tanstack/react-table";

import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import {
  Table as ShadcnTable, // Alias shadcn Table to avoid conflict
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Candidate } from '../lib/types'; // Import Candidate type from shared types
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"; // Import Dialog components

const initialData: Candidate[] = [
  {
    id: "m5gr84i9",
    name: "Neil",
    age: 58,
    email: "Abelardo27@gmail.com",
    jobTitle: "Software Engineer",
    aiScore: 68,
  },
  {
    id: "3kmjp43w",
    name: "Matteo",
    age: 25,
    email: "Adelia_Hagenes28@gmail.com",
    jobTitle: "Data Scientist",
    aiScore: 97,
  },
  {
    id: "4r38grw3",
    name: "Carlotta",
    age: 55,
    email: "Adeline.Wiza59@yahoo.com",
    jobTitle: "Project Manager",
    aiScore: 30,
  },
  {
    id: "dhm5utji",
    name: "Destini",
    age: 45,
    email: "Alanis_Bosco@gmail.com",
    jobTitle: "UX Designer",
    aiScore: 14,
  },
  {
    id: "e12z9c0h",
    name: "Drake",
    age: 34,
    email: "Alycia.Nitzsche39@yahoo.com",
    jobTitle: "Frontend Developer",
    aiScore: 96,
  },
  {
    id: "5e4f3g2h",
    name: "Whitney",
    age: 28,
    email: "America77@gmail.com",
    jobTitle: "Backend Developer",
    aiScore: 26,
  },
];

export const columns: ColumnDef<Candidate>[] = [
  {
    id: "select",
    header: ({ table }: { table: Table<Candidate> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: Row<Candidate> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Candidate Name",
    cell: ({ row }: { row: Row<Candidate> }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Candidate Email",
    cell: ({ row }: { row: Row<Candidate> }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }: { row: Row<Candidate> }) => <div>{row.getValue("age")}</div>,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }: { row: Row<Candidate> }) => <div>{row.getValue("jobTitle")}</div>,
  },
  {
    accessorKey: "aiScore",
    header: "AI Score",
    enableSorting: true,
    cell: ({ row }: { row: Row<Candidate> }) => <div>{row.getValue("aiScore")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }: { row: Row<Candidate> }) => {
      const candidate = row.original;

      const [isPopupOpen, setIsPopupOpen] = React.useState(false);
      const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);

      const handleViewAISummary = () => {
        setSelectedCandidate(candidate);
        setIsPopupOpen(true);
      };

      const handleDownloadCV = () => {
        if (selectedCandidate) {
          // Dummy download logic - in a real app, you'd fetch the actual CV
          alert(`Downloading CV for ${selectedCandidate.name}`);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                {/* Add ellipsis icon here */}
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewAISummary}>
                View AI Summary
              </DropdownMenuItem>
              {/* Add dropdown menu items here, e.g., View details, Download CV */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Candidate Details Popup */}
          <Dialog open={isPopupOpen} onOpenChange={() => setIsPopupOpen(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Candidate Details</DialogTitle>
                <DialogDescription>
                  AI-generated summary and options for {selectedCandidate?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedCandidate && (
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">AI Summary:</h3>
                  <p className="text-sm text-gray-600">
                    {/* Dummy AI Summary */}
                    This is a dummy AI-generated summary for {selectedCandidate.name}.
                    {selectedCandidate.name} is {selectedCandidate.age} years old and has an AI score of {selectedCandidate.aiScore}.
                    They are applying for the {selectedCandidate.jobTitle} position.
                  </p>
                  <Button onClick={handleDownloadCV} className="mt-4">
                    Download CV
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

const ResultsPage = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);

  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);


  React.useEffect(() => {
    // Read data from local storage when the component mounts
    const storedCandidates = localStorage.getItem('candidateResults');
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const table = useReactTable({
    data: candidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleDeleteSelected = () => {
    setIsConfirmationOpen(true);
  };

  const confirmDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    console.log("Deleting selected candidates:", selectedIds);
    const updatedCandidates = candidates.filter(candidate => !selectedIds.includes(candidate.id));
    setCandidates(updatedCandidates);
    localStorage.setItem('candidateResults', JSON.stringify(updatedCandidates));
    table.toggleAllPageRowsSelected(false);
    setIsConfirmationOpen(false);
  };

  const handleDownloadCV = () => {
    if (selectedCandidate) {
      // Dummy download logic - in a real app, you'd fetch the actual CV
      alert(`Downloading CV for ${selectedCandidate.name}`);
    }
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Job Results</h1>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Search emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Sort By AI Score
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={sorting[0]?.id === "aiScore" && sorting[0]?.desc === false}
              onCheckedChange={() =>
                setSorting([{ id: "aiScore", desc: false }])
              }
            >
              AI Score Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={sorting[0]?.id === "aiScore" && sorting[0]?.desc === true}
              onCheckedChange={() =>
                setSorting([{ id: "aiScore", desc: true }])
              }
            >
              AI Score Desc
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {Object.keys(rowSelection).length > 0 && (
        <Button
          variant="destructive"
          onClick={handleDeleteSelected}
          className="ml-auto"
        >
          Delete ({Object.keys(rowSelection).length})
        </Button>
      )}

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected candidates?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSelected}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="rounded-md border">
        <ShadcnTable>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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

      {/* Candidate Details Popup */}
      <Dialog open={isPopupOpen} onOpenChange={() => setIsPopupOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogDescription>
              AI-generated summary and options for {selectedCandidate?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">AI Summary:</h3>
              <p className="text-sm text-gray-600">
                {/* Dummy AI Summary */}
                This is a dummy AI-generated summary for {selectedCandidate.name}.
                {selectedCandidate.name} is {selectedCandidate.age} years old and has an AI score of {selectedCandidate.aiScore}.
                They are applying for the {selectedCandidate.jobTitle} position.
              </p>
              <Button onClick={handleDownloadCV} className="mt-4">
                Download CV
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsPage;
