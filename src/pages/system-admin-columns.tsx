import { ColumnDef } from "@tanstack/react-table";
import { SystemAdmin, getPermissionLevelName, getStatusName } from "@/types/system-admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Trash2, KeyRound, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox"; // Removed Checkbox import
import { toast } from "@/hooks/use-toast"; // For placeholder actions

// Placeholder function for issuing temporary password
const handleIssueTempPassword = (admin: SystemAdmin) => {
  console.log("Issuing temporary password for:", admin.name, admin.id);
  // TODO: Implement API call and confirmation dialog
  toast({
    title: "一時パスワード発行 (実装保留)",
    description: `${admin.name} の一時パスワードを発行します。`,
  });
};

// Placeholder function for deleting admin
const handleDeleteAdmin = (admin: SystemAdmin) => {
  console.log("Deleting admin:", admin.name, admin.id);
  // TODO: Implement API call and confirmation dialog
  toast({
    title: "管理者削除 (実装保留)",
    description: `${admin.name} を削除します。`,
    variant: "destructive",
  });
};

// Placeholder function for editing admin
const handleEditAdmin = (admin: SystemAdmin) => {
    console.log("Editing admin:", admin.name, admin.id);
    // TODO: Implement navigation to an edit page or open an edit modal
    toast({
      title: "管理者編集 (実装保留)",
      description: `${admin.name} の編集画面へ遷移します。`,
    });
  };


export const columns: ColumnDef<SystemAdmin>[] = [
  // Removed the checkbox column definition
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       onClick={(e) => e.stopPropagation()} // Prevent row click when interacting with checkbox
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          氏名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "メールアドレス",
  },
  {
    accessorKey: "permissionLevel",
    header: "権限レベル",
    cell: ({ row }) => getPermissionLevelName(row.original.permissionLevel),
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {getStatusName(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            最終ログイン
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => {
      const lastLogin = row.original.lastLogin;
      return lastLogin ? lastLogin.toLocaleString('ja-JP') : 'N/A';
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const admin = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Stop propagation to prevent row click when opening menu */}
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>アクション</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditAdmin(admin); }}>
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleIssueTempPassword(admin); }}>
              <KeyRound className="mr-2 h-4 w-4" />
              一時パスワード発行
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin); }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
