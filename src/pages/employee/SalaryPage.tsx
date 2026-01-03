import { DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/ui/stat-card";

// TODO: Integrate with backend API - use payrollService.getMySalary()
const SalaryPage = () => {
  const salaryInfo = {
    monthlySalary: 0,
    yearlySalary: 0,
    status: "Pending",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Salary Information</h1>
        <p className="text-muted-foreground">View your salary details</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Monthly Salary"
          value={`$${salaryInfo.monthlySalary.toLocaleString()}`}
          subtitle="Net pay per month"
          icon={DollarSign}
          variant="accent"
        />
        <StatCard
          title="Yearly Salary"
          value={`$${salaryInfo.yearlySalary.toLocaleString()}`}
          subtitle="Annual earnings"
          icon={TrendingUp}
          variant="success"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Salary Status</p>
                <div className="mt-2">
                  <Badge
                    className={
                      salaryInfo.status === "Paid"
                        ? "bg-success text-success-foreground text-lg px-4 py-1"
                        : "bg-warning text-warning-foreground text-lg px-4 py-1"
                    }
                  >
                    {salaryInfo.status}
                  </Badge>
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalaryPage;
