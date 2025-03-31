'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, projectsApi } from '@/lib/api';

interface SDGStats {
  [key: string]: {
    count: number;
    projects: Project[];
  };
}

export default function SDGsPage() {
  const [sdgStats, setSdgStats] = useState<SDGStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        const projects = Array.isArray(data) ? data : [];
        
        // Calculate SDG statistics
        const stats: SDGStats = {};
        projects.forEach(project => {
          project.sdgs.forEach(sdg => {
            if (!stats[sdg]) {
              stats[sdg] = {
                count: 0,
                projects: []
              };
            }
            stats[sdg].count++;
            stats[sdg].projects.push(project);
          });
        });
        
        setSdgStats(stats);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setSdgStats({});
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Sustainable Development Goals</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(sdgStats).map(([sdg, stats]) => (
            <Card key={sdg}>
              <CardHeader>
                <CardTitle>SDG {sdg}</CardTitle>
                <p className="text-sm text-gray-500">{stats.count} Projects</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Featured Projects:</h3>
                  <ul className="list-disc pl-6">
                    {stats.projects.slice(0, 3).map(project => (
                      <li key={project.id} className="text-sm">
                        {project.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 