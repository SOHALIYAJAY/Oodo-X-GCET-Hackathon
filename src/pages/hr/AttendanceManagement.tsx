import { useState } from "react";
import { Calendar, Search, Edit, Save, X } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// TODO: Integrate with backend API - use attendanceService.getAll()
const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2024-01-16");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ checkIn: "", checkOut: "", status: "" });

  const filteredAttendance = attendance.filter(
    (record) =>
      record.date === selectedDate &&
      (record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.empId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setEditData({
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
    });
  };

  const handleSave = (id: number) => {
    setAttendance(
      attendance.map((record) =>
        record.id === id
          ? { ...record, ...editData }
          : record
      )
    );
    setEditingId(null);
    toast({ title: "Success", description: "Attendance record updated" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ checkIn: "", checkOut: "", status: "" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-success text-success-foreground">Present</Badge>;
      case "Late":
        return <Badge className="bg-warning text-warning-foreground">Late</Badge>;
      case "Absent":
        return <Badge className="bg-destructive text-destructive-foreground">Absent</Badge>;
      case "On Leave":
        return <Badge className="bg-accent text-accent-foreground">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Stats for selected date
  const stats = {
    present: filteredAttendance.filter((r) => r.status === "Present").length,
    late: filteredAttendance.filter((r) => r.status === "Late").length,
    absent: filteredAttendance.filter((r) => r.status === "Absent").length,
    onLeave: filteredAttendance.filter((r) => r.status === "On Leave").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">View and manage employee attendance records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-3xl font-bold text-success">{stats.present}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="text-3xl font-bold text-warning">{stats.late}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-3xl font-bold text-destructive">{stats.absent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">On Leave</p>
              <p className="text-3xl font-bold text-accent">{stats.onLeave}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Extra Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
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
                      <span className="font-medium">{record.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{record.empId}</TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Input
                        value={editData.checkIn}
                        onChange={(e) =>
                          setEditData({ ...editData, checkIn: e.target.value })
                        }
                        className="w-24"
                      />
                    ) : (
                      record.checkIn
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Input
                        value={editData.checkOut}
                        onChange={(e) =>
                          setEditData({ ...editData, checkOut: e.target.value })
                        }
                        className="w-24"
                      />
                    ) : (
                      record.checkOut
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{record.hours}</TableCell>
                  <TableCell>
                    <span
                      className={
                        record.extra !== "0m" && record.extra !== "-"
                          ? "font-medium text-success"
                          : "text-muted-foreground"
                      }
                    >
                      {record.extra}
                    </span>
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Select
                        value={editData.status}
                        onValueChange={(value) =>
                          setEditData({ ...editData, status: value })
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(record.status)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === record.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSave(record.id)}
                          className="h-8 w-8 text-success"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancel}
                          className="h-8 w-8 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(record)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
