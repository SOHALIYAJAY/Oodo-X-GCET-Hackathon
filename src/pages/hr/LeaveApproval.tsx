import { useState } from "react";
import { Search, Check, X, Eye, Filter } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// TODO: Integrate with backend API - use leaveService.getAll()
const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const filterByStatus = (status: string) => {
    return leaveRequests.filter(
      (request) =>
        request.status.toLowerCase() === status &&
        (request.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.empId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const pendingRequests = filterByStatus("pending");
  const approvedRequests = filterByStatus("approved");
  const rejectedRequests = filterByStatus("rejected");

  const handleApprove = (id: number) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "Approved" } : request
      )
    );
    toast({ title: "Success", description: "Leave request approved" });
  };

  const handleReject = (id: number) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "Rejected" } : request
      )
    );
    setSelectedRequest(null);
    setIsViewDialogOpen(false);
    setRejectReason("");
    toast({ title: "Leave Rejected", description: "Leave request has been rejected" });
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderTable = (data: any[], showActions: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showActions ? 7 : 6} className="text-center text-muted-foreground py-8">
              No leave requests found
            </TableCell>
          </TableRow>
        ) : (
          data.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent/10 text-accent text-xs">
                      {request.employee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.employee}</p>
                    <p className="text-xs text-muted-foreground">{request.empId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{request.from}</p>
                  <p className="text-muted-foreground">to {request.to}</p>
                </div>
              </TableCell>
              <TableCell>{request.days}</TableCell>
              <TableCell>{request.appliedOn}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleViewDetails(request)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleApprove(request.id)}
                      className="h-8 w-8 text-success hover:text-success"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsViewDialogOpen(true);
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Approval</h1>
        <p className="text-muted-foreground">Review and manage employee leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingRequests.length}</p>
              </div>
              <div className="rounded-full bg-warning/10 p-3">
                <Filter className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-success">{approvedRequests.length}</p>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <Check className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold text-destructive">{rejectedRequests.length}</p>
              </div>
              <div className="rounded-full bg-destructive/10 p-3">
                <X className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {renderTable(pendingRequests, true)}
            </TabsContent>
            <TabsContent value="approved">
              {renderTable(approvedRequests, false)}
            </TabsContent>
            <TabsContent value="rejected">
              {renderTable(rejectedRequests, false)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View/Reject Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Review the leave request details below.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-accent/10 text-accent">
                    {selectedRequest.employee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedRequest.employee}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.empId}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Leave Type</p>
                  <p className="font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedRequest.days} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{selectedRequest.from}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">{selectedRequest.to}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{selectedRequest.reason}</p>
              </div>
              {selectedRequest.status === "Pending" && (
                <div className="space-y-2">
                  <Label>Rejection Reason (optional)</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedRequest?.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-success hover:bg-success/90"
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setIsViewDialogOpen(false);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            {selectedRequest?.status !== "Pending" && (
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveApproval;
