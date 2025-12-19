import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchAllEnquiries, fetchGlobalAnalytics } from "@/lib/api";

export default function AdminDashboard() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: enquiries = [], isLoading: enquiriesLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchAllEnquiries,
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics", "global"],
    queryFn: fetchGlobalAnalytics,
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-destructive/10 rounded border border-destructive/30 flex items-center justify-center text-destructive">
              <Settings className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-lg">PMGX Admin</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut className="mr-2 h-4 w-4" /> Exit
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Enquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
              <p className="text-xs text-muted-foreground">Client requests tracked</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Visitors</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeVisitors || 0}</div>
              <p className="text-xs text-muted-foreground">Currently viewing projects</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalProjectViews || 0}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-white/5">
          <CardHeader>
            <CardTitle>Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Enquiries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Loading projects...
                    </TableCell>
                  </TableRow>
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No projects yet
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${project.status === 'live' ? 'border-emerald-500/30 text-emerald-500' : ''}
                        ${project.status === 'demo' ? 'border-amber-500/30 text-amber-500' : ''}
                        ${project.status === 'concept' ? 'border-blue-500/30 text-blue-500' : ''}
                      `}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.views.toLocaleString()}</TableCell>
                    <TableCell>{project.enquiries}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
