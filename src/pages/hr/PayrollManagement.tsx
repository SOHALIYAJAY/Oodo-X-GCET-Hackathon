import { useState } from "react";
import { Search, DollarSign, Check, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatCard from "@/components/ui/stat-card";
import { toast } from "@/hooks/use-toast";

// TODO: Integrate with backend API - use payrollService.getAll()
const months = [
  "January 2024",
  "December 2023",
  "November 2023",
  "October 2023",
];

const PayrollManagement = () => {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January 2024");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredPayroll = payroll.filter(
    (record) =>
      record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsPaid = (id: number) => {
    setPayroll(
      payroll.map((record) =>
        record.id === id ? { ...record, status: "Paid" } : record
      )
    );
    toast({ title: "Success", description: "Salary marked as paid" });
  };

  const handleMarkAllAsPaid = () => {
    setPayroll(
      payroll.map((record) => ({ ...record, status: "Paid" }))
    );
    toast({ title: "Success", description: "All salaries marked as paid" });
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  // Stats
  const totalPayroll = payroll.reduce((sum, p) => sum + p.net, 0);
  const paidAmount = payroll.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.net, 0);
  const pendingAmount = payroll.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.net, 0);
  const pendingCount = payroll.filter((p) => p.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={handleMarkAllAsPaid}
            className="bg-accent hover:bg-accent/90"
            disabled={pendingCount === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark All as Paid
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Payroll"
          value={`$${totalPayroll.toLocaleString()}`}
          subtitle={selectedMonth}
          icon={DollarSign}
          variant="accent"
        />
        <StatCard
          title="Paid"
          value={`$${paidAmount.toLocaleString()}`}
          subtitle={`${payroll.filter((p) => p.status === "Paid").length} employees`}
          icon={Check}
          variant="success"
        />
        <StatCard
          title="Pending"
          value={`$${pendingAmount.toLocaleString()}`}
          subtitle={`${pendingCount} employees`}
          icon={DollarSign}
          variant="warning"
        />
        <StatCard
          title="Total Employees"
          value={payroll.length}
          subtitle="On payroll"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name, ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll - {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>Allowance</TableHead>
                <TableHead>Deduction</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayroll.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent/10 text-accent text-xs">
                          {record.employee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{record.employee}</p>
                        <p className="text-xs text-muted-foreground">{record.empId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>${record.basic.toLocaleString()}</TableCell>
                  <TableCell className="text-success">
                    +${record.allowance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-destructive">
                    -${record.deduction.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold">
                    ${record.net.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.status === "Paid"
                          ? "bg-success text-success-foreground"
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetails(record)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {record.status === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(record.id)}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salary Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown for {selectedMonth}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-accent/10 text-accent">
                    {selectedEmployee.employee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedEmployee.employee}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.empId} • {selectedEmployee.department}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-medium">${selectedEmployee.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Housing Allowance</span>
                  <span className="text-success">+$250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transport Allowance</span>
                  <span className="text-success">+$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meal Allowance</span>
                  <span className="text-success">+$100</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Allowances</span>
                    <span className="font-medium text-success">
                      +${selectedEmployee.allowance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Deduction</span>
                  <span className="text-destructive">-$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="text-destructive">-$50</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Deductions</span>
                    <span className="font-medium text-destructive">
                      -${selectedEmployee.deduction.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="border-t-2 border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Net Salary</span>
                    <span className="text-lg font-bold text-accent">
                      ${selectedEmployee.net.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge
                  className={
                    selectedEmployee.status === "Paid"
                      ? "bg-success text-success-foreground"
                      : "bg-warning text-warning-foreground"
                  }
                >
                  {selectedEmployee.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedEmployee?.status === "Pending" && (
              <Button
                onClick={() => {
                  handleMarkAsPaid(selectedEmployee.id);
                  setIsViewDialogOpen(false);
                }}
                className="bg-success hover:bg-success/90"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollManagement;
