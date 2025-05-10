import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, PlusCircle, ArrowUpDown } from "lucide-react";
import { cn } from '@/lib/utils';
// Removed date-fns imports as contract dates are removed

// --- Mock Data ---
// Simplified mock data - removed plan, startDate, endDate, users, maxUsers
const mockCompanies = [
  { id: 1, name: "株式会社テクノロジー", adminCount: 5, status: "アクティブ" },
  { id: 2, name: "グローバル商事", adminCount: 20, status: "アクティブ" },
  { id: 3, name: "未来建設", adminCount: 10, status: "休止中" },
  { id: 4, name: "エコソリューションズ", adminCount: 3, status: "アクティブ" },
  { id: 5, name: "デジタルメディア", adminCount: 8, status: "審査中" },
  { id: 6, name: "ヘルステック・イノベーションズ", adminCount: 7, status: "アクティブ" },
  { id: 7, name: "スマート物流", adminCount: 12, status: "アクティブ" },
  { id: 8, name: "クリエイティブデザイン", adminCount: 4, status: "アクティブ" },
  { id: 9, name: "フードサービス・ジャパン", adminCount: 15, status: "休止中" },
  { id: 10, name: "教育ソリューションズ", adminCount: 9, status: "アクティブ" },
  { id: 11, name: "リージョナルバンク", adminCount: 6, status: "審査中" },
  { id: 12, name: "アドバンスト・マニュファクチャリング", adminCount: 25, status: "アクティブ" },
];

// Type definition for SortKey and SortDirection
// (CompanyData type removed as it's not used in the component)
// Updated SortKey type - removed plan, startDate, endDate, users
type SortKey = 'name' | 'adminCount' | 'status' | null;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5;

export default function Companies() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // Removed planFilter state
  const [currentPage, setCurrentPage] = useState(1); // Moved state declaration here (FIXED)

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = mockCompanies.filter(company => {
      // Status Filter
      if (statusFilter !== 'all' && company.status !== statusFilter) {
        return false;
      }
      // Removed Plan Filter
      // Search Term Filter (case-insensitive) - removed plan from search
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          company.name.toLowerCase().includes(lowerSearchTerm) ||
          company.status.toLowerCase().includes(lowerSearchTerm)
        );
      }
      return true;
    });

    // Sorting - removed plan, startDate, endDate, users cases
    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        // Removed date sorting
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortKey, sortDirection, statusFilter]); // Removed planFilter dependency

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [filteredAndSortedCompanies, currentPage]); // Now currentPage is declared before this

  // --- Handlers ---
  // currentPage state is now declared above

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Removed handlePlanFilterChange

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (companyId: number) => {
    navigate(`/companies/update/${companyId}`);
  };

  // --- Helper Functions ---
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "アクティブ": return "bg-green-100 text-green-800";
      case "休止中": return "bg-red-100 text-red-800";
      case "審査中": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Removed isNearExpiry and formatDate functions

  // --- Render ---
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header and Controls */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">企業一覧</h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="企業名などで検索..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 w-full md:w-[250px] lg:w-[300px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ステータス</SelectItem>
                <SelectItem value="アクティブ">アクティブ</SelectItem>
                <SelectItem value="休止中">休止中</SelectItem>
                <SelectItem value="審査中">審査中</SelectItem>
              </SelectContent>
            </Select>
            {/* Removed Plan Filter Select */}
          </div>
          {/* Add Company Button */}
          <Link to="/companies/add" className={cn(buttonVariants({ variant: "default", size: "default" }), 'w-full md:w-auto')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規企業を追加
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Updated headers - removed plan, dates, users */}
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                企業名 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'name' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50 text-right" onClick={() => handleSort('adminCount')}>
                管理者数 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'adminCount' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                ステータス <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'status' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  onClick={() => handleRowClick(company.id)}
                  className={cn(
                    'cursor-pointer',
                    // Removed expiry highlighting
                    'hover:bg-gray-50'
                  )}
                >
                  {/* Updated cells - removed plan, dates, users */}
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="text-right">{company.adminCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(company.status)}`}>
                      {company.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Adjusted colSpan */}
                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                  該当する企業が見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={cn(currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                 const page = i + 1;
                 const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                 const showEllipsis = Math.abs(page - currentPage) === 2 && totalPages > 5;

                 if (showEllipsis) {
                   // Ensure unique keys for ellipsis and prevent duplicates visually
                   const key = page < currentPage ? `ellipsis-start-${page}` : `ellipsis-end-${page}`;
                   // Check if an ellipsis for this position range is already rendered (simple check)
                   const existingEllipsis = document.querySelector(`[data-ellipsis-key="${key}"]`);
                   if (!existingEllipsis) {
                       return <PaginationItem key={key} data-ellipsis-key={key}><PaginationEllipsis /></PaginationItem>;
                   }
                   return null;
                 }

                 if (showPage) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                 }
                 return null;
              })}


              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={cn(currentPage === totalPages ? 'pointer-events-none opacity-50' : '')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
