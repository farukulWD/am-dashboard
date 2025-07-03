import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between pt-4 gap-2 ${className}`}>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
        <button
          className="px-3 py-1 w-1/3 sm:w-auto cursor-pointer border border-border rounded text-sm flex items-center gap-1 disabled:opacity-50"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" /> <span className="hidden xs:inline">Previous</span>
        </button>
        <p className="text-sm w-full text-center">
          Page {currentPage} of {totalPages}
        </p>
        <button
          className="px-3 py-1 w-1/3 sm:w-auto cursor-pointer border border-border rounded text-sm flex items-center gap-1 disabled:opacity-50"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <span className="hidden xs:inline">Next</span> <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 