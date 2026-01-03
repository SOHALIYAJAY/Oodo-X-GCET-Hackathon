import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { attendanceService } from "@/services/attendance.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const EmployeeAttendance = () => {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: () => attendanceService.getMyAttendance(),
  });

  const checkInMutation = useMutation({
    mutationFn: () => attendanceService.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      toast({
        title: "Checked In",
        description: "You have successfully checked in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check in",
        variant: "destructive",
      });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => attendanceService.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      toast({
        title: "Checked Out",
        description: "You have successfully checked out.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check out",
        variant: "destructive",
      });
    },
  });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return dateString;
    }
  };

  const formatHours = (minutes: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceData?.find((record: any) => 
    record.date && new Date(record.date).toISOString().split('T')[0] === today
  );

  const isCheckedIn = todayRecord?.checkIn && !todayRecord?.checkOut;
  const hasCompletedToday = todayRecord?.checkOut !== undefined;

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">Track your daily attendance</p>
      </div>

      {/* Check In/Out Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
            {/* Date & Time */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>{todayFormatted}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-6 w-6 text-accent" />
                <span className="text-3xl font-bold text-foreground">{currentTime}</span>
              </div>
              {todayRecord?.checkIn && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Checked in at: <span className="font-medium text-foreground">{formatTime(todayRecord.checkIn)}</span>
                </p>
              )}
            </div>

            {/* Check In/Out Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleCheckIn}
                disabled={isCheckedIn || hasCompletedToday || checkInMutation.isPending}
                size="lg"
                className="h-24 w-24 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                <div className="flex flex-col items-center">
                  <LogIn className="h-8 w-8" />
                  <span className="mt-1 text-xs">Check In</span>
                </div>
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={!isCheckedIn || hasCompletedToday || checkOutMutation.isPending}
                size="lg"
                className="h-24 w-24 rounded-full bg-success text-success-foreground hover:bg-success/90 disabled:opacity-50"
              >
                <div className="flex flex-col items-center">
                  <LogOut className="h-8 w-8" />
                  <span className="mt-1 text-xs">Check Out</span>
                </div>
              </Button>
            </div>

            {/* Status */}
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">Today's Status</p>
              <Badge
                className={`mt-2 text-sm ${
                  hasCompletedToday
                    ? "bg-success text-success-foreground"
                    : isCheckedIn
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {hasCompletedToday
                  ? "Completed"
                  : isCheckedIn
                  ? "Checked In"
                  : "Not Checked In"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Extra Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData && attendanceData.length > 0 ? (
                  attendanceData.map((record: any) => (
                    <TableRow key={record._id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), 'yyyy-MM-dd')}
                      </TableCell>
                      <TableCell>{formatTime(record.checkIn)}</TableCell>
                      <TableCell>{formatTime(record.checkOut)}</TableCell>
                      <TableCell className="font-medium">{formatHours(record.workHours || 0)}</TableCell>
                      <TableCell>
                        <span className={record.extraHours > 0 ? "text-success font-medium" : "text-muted-foreground"}>
                          {formatHours(record.extraHours || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAttendance;