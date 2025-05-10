import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
  Row, // Import Row
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Removed DropdownMenu imports as they are no longer needed for actions
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpDown,
  // MoreHorizontal, // Removed as action trigger is gone
  Search,
  // UserCheck, // Removed action icons
  // UserX,
  // KeyRound,
  // Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusCircle, // Icon for Add button
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';

// --- Mock Data ---
const mockCompanies = [
  { id: 1, name: "株式会社テクノロジー" },
  { id: 2, name: "グローバル商事" },
  { id: 3, name: "未来建設" },
  { id: 4, name: "エコソリューションズ" },
];

const mockAdmins = [
  { id: 'adm001', companyId: 1, companyName: "株式会社テクノロジー", name: "田中 太郎", email: "tanaka.taro@tech.co.jp", role: "管理者", lastLogin: "2024-07-10T10:30:00Z", status: "アクティブ" },
  { id: 'adm002', companyId: 1, companyName: "株式会社テクノロジー", name: "鈴木 一郎", email: "suzuki.ichiro@tech.co.jp", role: "担当者", lastLogin: "2024-07-09T15:00:00Z", status: "アクティブ" },
  { id: 'adm003', companyId: 2, companyName: "グローバル商事", name: "佐藤 花子", email: "sato.hanako@global.com", role: "管理者", lastLogin: "2024-07-11T09:00:00Z", status: "アクティブ" },
  { id: 'adm004', companyId: 3, companyName: "未来建設", name: "高橋 健太", email: "takahashi.kenta@mirai.co.jp", role: "管理者", lastLogin: "2024-06-20T11:00:00Z", status: "非アクティブ" },
  { id: 'adm005', companyId: 2, companyName: "グローバル商事", name: "伊藤 次郎", email: "ito.jiro@global.com", role: "担当者", lastLogin: null, status: "アクティブ" },
  { id: 'adm006', companyId: 4, companyName: "エコソリューションズ", name: "渡辺 直美", email: "watanabe.naomi@eco.jp", role: "管理者", lastLogin: "2024-07-01T14:25:00Z", status: "アクティブ" },
  { id: 'adm007', companyId: 1, companyName: "株式会社テクノロジー", name: "山本 三郎", email: "yamamoto.saburo@tech.co.jp", role: "担当者", lastLogin: "2024-05-15T08:10:00Z", status: "非アクティブ" },
  { id: 'adm008', companyId: 3, companyName: "未来建設", name: "中村 美咲", email: "nakamura.misaki@mirai.co.jp", role: "担当者", lastLogin: "2024-07-10T18:00:00Z", status: "アクティブ" },
];

type Admin = typeof mockAdmins[0];

// --- Helper Functions ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'ログインなし';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '無効な日付';
    return format(date, 'yyyy/MM/dd HH:mm', { locale: ja });
  } catch (e) {
    return 'フォーマットエラー';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "アクティブ": return "bg-green-100 text-green-800 border-green-300";
    case "非アクティブ": return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// --- Column Definitions ---
// Removed the actions column definition
const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        企業名
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        管理者名
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "メールアドレス",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        権限
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        最終ログイン
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("lastLogin"))}</div>,
    sortingFn: 'datetime',
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ステータス
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant="outline" className={cn("border", getStatusBadgeClass(status))}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value === "all" || row.getValue(id) === value;
    },
  },
  // { // --- REMOVED ACTIONS COLUMN ---
  //   id: "actions",
  //   cell: ({ row }) => {
  //     // ... action menu logic was here ...
  //   },
  // },
];

// --- Component ---
export default function CompanyAdmins() {
  const navigate = useNavigate(); // Initialize navigate
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo(() => mockAdmins, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleCompanyFilterChange = (value: string) => {
    table.getColumn('companyName')?.setFilterValue(value === 'all' ? undefined : value);
  };

  const handleStatusFilterChange = (value: string) => {
    table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value);
  };

  // Row click handler
  const handleRowClick = (row: Row<Admin>) => {
    // Navigate to a hypothetical detail page route
    navigate(`/company-admins/detail/${row.original.id}`);
  };


  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-2xl font-semibold text-gray-900">企業管理者一覧</h2>
         {/* Add Admin Button */}
         <Button onClick={() => navigate('/company-admins/add')}>
           <PlusCircle className="mr-2 h-4 w-4" /> 新規管理者を追加
         </Button>
      </div>


      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
           <div className="relative flex-grow md:flex-grow-0">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
             <Input
               placeholder="名前、メール等で検索..."
               value={globalFilter ?? ''}
               onChange={(event) => setGlobalFilter(event.target.value)}
               className="pl-9 w-full md:w-[250px] lg:w-[300px]"
             />
           </div>
           <Select
             value={table.getColumn('companyName')?.getFilterValue() as string ?? 'all'}
             onValueChange={handleCompanyFilterChange}
           >
             <SelectTrigger className="w-full md:w-[200px]">
               <SelectValue placeholder="企業で絞り込み" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">全ての企業</SelectItem>
               {mockCompanies.map(company => (
                 <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Select
             value={table.getColumn('status')?.getFilterValue() as string ?? 'all'}
             onValueChange={handleStatusFilterChange}
           >
             <SelectTrigger className="w-full md:w-[150px]">
               <SelectValue placeholder="ステータス" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">全ステータス</SelectItem>
               <SelectItem value="アクティブ">アクティブ</SelectItem>
               <SelectItem value="非アクティブ">非アクティブ</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-md border bg-white shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                  onClick={() => handleRowClick(row)} // Add onClick handler
                  className="cursor-pointer hover:bg-muted/50" // Add cursor and hover effect
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
                  // Adjust colSpan since actions column is removed
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  該当する管理者が見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
         <div className="flex-1 text-sm text-muted-foreground">
           全 {table.getFilteredRowModel().rows.length} 件中 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} 件を表示
         </div>
         <div className="flex items-center space-x-2">
            <span className="text-sm mr-2">表示件数:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>
         <div className="flex items-center space-x-1">
           <Button
             variant="outline"
             className="h-8 w-8 p-0"
             onClick={() => table.setPageIndex(0)}
             disabled={!table.getCanPreviousPage()}
           >
             <span className="sr-only">最初のページ</span>
             <ChevronsLeft className="h-4 w-4" />
           </Button>
           <Button
             variant="outline"
             className="h-8 w-8 p-0"
             onClick={() => table.previousPage()}
             disabled={!table.getCanPreviousPage()}
           >
             <span className="sr-only">前のページ</span>
             <ChevronLeft className="h-4 w-4" />
           </Button>
            <span className="text-sm mx-2">
              ページ {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
           <Button
             variant="outline"
             className="h-8 w-8 p-0"
             onClick={() => table.nextPage()}
             disabled={!table.getCanNextPage()}
           >
             <span className="sr-only">次のページ</span>
             <ChevronRight className="h-4 w-4" />
           </Button>
           <Button
             variant="outline"
             className="h-8 w-8 p-0"
             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
             disabled={!table.getCanNextPage()}
           >
             <span className="sr-only">最後のページ</span>
             <ChevronsRight className="h-4 w-4" />
           </Button>
         </div>
       </div>
    </div>
  );
}
