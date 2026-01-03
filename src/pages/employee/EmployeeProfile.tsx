import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

// TODO: Integrate with backend API - use employeeService and authService
const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    department: "",
    joinDate: "",
    employeeId: "",
  });

  const [editableFields, setEditableFields] = useState({
    phone: profile.phone,
    address: profile.address,
  });

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      phone: editableFields.phone,
      address: editableFields.address,
    }));
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">View and update your personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.role}</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                {profile.department}
              </div>
              <div className="mt-4 w-full space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>ID: {profile.employeeId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {profile.joinDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Read-only fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email Address</Label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Role</Label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Department</Label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.department}</span>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="border-t border-border pt-6">
              <h3 className="mb-4 font-medium text-foreground">Editable Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={editableFields.phone}
                      onChange={(e) =>
                        setEditableFields((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={editableFields.address}
                      onChange={(e) =>
                        setEditableFields((prev) => ({ ...prev, address: e.target.value }))
                      }
                      className="min-h-[80px] pl-10"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSave} className="mt-4 bg-accent hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfile;
