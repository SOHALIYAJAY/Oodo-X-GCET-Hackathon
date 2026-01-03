import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { employeeService, Employee } from "@/services/employee.service";

// TODO: Integrate with backend API - use employeeService.getAll()
const departments = ["Engineering", "Marketing", "HR", "Finance", "Design", "Sales"];
const roles = ["Software Developer", "Senior Developer", "Manager", "Specialist", "Designer", "Executive"];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      _id: "1",
      employeeId: "EMP001",
      userId: "user1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      phone: "+91-9876543210",
      department: "Engineering",
      role: "Senior Software Developer",
      status: "Active",
      joinDate: "2023-01-15"
    },
    {
      _id: "2",
      employeeId: "EMP002",
      userId: "user2",
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      phone: "+91-9876543211",
      department: "Marketing",
      role: "Marketing Manager",
      status: "Active",
      joinDate: "2023-02-20"
    },
    {
      _id: "3",
      employeeId: "EMP003",
      userId: "user3",
      name: "Amit Singh",
      email: "amit.singh@company.com",
      phone: "+91-9876543212",
      department: "HR",
      role: "HR Specialist",
      status: "Active",
      joinDate: "2023-03-10"
    },
    {
      _id: "4",
      employeeId: "EMP004",
      userId: "user4",
      name: "Kavita Patel",
      email: "kavita.patel@company.com",
      phone: "+91-9876543213",
      department: "Finance",
      role: "Financial Analyst",
      status: "Active",
      joinDate: "2023-04-05"
    },
    {
      _id: "5",
      employeeId: "EMP005",
      userId: "user5",
      name: "Vikram Rao",
      email: "vikram.rao@company.com",
      phone: "+91-9876543214",
      department: "Engineering",
      role: "DevOps Engineer",
      status: "Active",
      joinDate: "2023-05-12"
    },
    {
      _id: "6",
      employeeId: "EMP006",
      userId: "user6",
      name: "Anjali Gupta",
      email: "anjali.gupta@company.com",
      phone: "+91-9876543215",
      department: "Design",
      role: "UI/UX Designer",
      status: "Active",
      joinDate: "2023-06-18"
    },
    {
      _id: "7",
      employeeId: "EMP007",
      userId: "user7",
      name: "Suresh Reddy",
      email: "suresh.reddy@company.com",
      phone: "+91-9876543216",
      department: "Sales",
      role: "Sales Executive",
      status: "On Leave",
      joinDate: "2023-07-22"
    },
    {
      _id: "8",
      employeeId: "EMP008",
      userId: "user8",
      name: "Meera Joshi",
      email: "meera.joshi@company.com",
      phone: "+91-9876543217",
      department: "Engineering",
      role: "Software Developer",
      status: "Active",
      joinDate: "2023-08-30"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEmployee = async () => {
    if (!formData.name || !formData.email || !formData.department || !formData.role) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newEmployee: Employee = {
      _id: String(Date.now()),
      employeeId: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      userId: `user${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0]
    };

    setEmployees([...employees, newEmployee]);
    setFormData({ name: "", email: "", phone: "", department: "", role: "" });
    setIsAddDialogOpen(false);
    toast({ title: "Success", description: "Employee added successfully" });
    setIsSubmitting(false);
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee || !formData.name || !formData.email || !formData.department || !formData.role) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setEmployees(
      employees.map((emp) =>
        emp._id === selectedEmployee._id
          ? { ...emp, ...formData }
          : emp
      )
    );
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    setFormData({ name: "", email: "", phone: "", department: "", role: "" });
    toast({ title: "Success", description: "Employee updated successfully" });
    setIsSubmitting(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp._id !== id));
    toast({ title: "Success", description: "Employee deleted successfully" });
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "On Leave":
        return <Badge className="bg-warning text-warning-foreground">On Leave</Badge>;
      case "Inactive":
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground">Manage your organization's employees</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the details of the new employee.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-1234"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} className="bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-accent/10 text-accent">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(employee)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEmployee(employee._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee} className="bg-accent hover:bg-accent/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
