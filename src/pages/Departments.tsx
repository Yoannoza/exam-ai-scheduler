
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, Plus, Search, Users, Trash2, FileEdit, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Department {
  id: string;
  name: string;
  short_name: string;
  levels: string[];
  students: number;
  exams: number;
}

const Departments = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Fetch departments from Supabase
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
        
      if (error) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les filières: ${error.message}`,
          variant: "destructive"
        });
        return [];
      }
      
      return data as Department[];
    },
  });

  // Add department mutation
  const addDepartmentMutation = useMutation({
    mutationFn: async (newDepartment: Omit<Department, 'id'>) => {
      const { data, error } = await supabase
        .from('departments')
        .insert([newDepartment])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Filière ajoutée",
        description: "La filière a été ajoutée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter la filière: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: async (department: Department) => {
      const { id, ...departmentData } = department;
      const { data, error } = await supabase
        .from('departments')
        .update(departmentData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Filière mise à jour",
        description: "La filière a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la filière: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation({
    mutationFn: async (departmentId: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);
        
      if (error) throw error;
      return departmentId;
    },
    onSuccess: (departmentId) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Filière supprimée",
        description: "La filière a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la filière: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    department.short_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    // This would typically open a modal for adding a department
    // For now, we'll add a sample department
    const newDepartment = {
      name: "Nouvelle Filière",
      short_name: "NF",
      levels: ["L1"],
      students: 0,
      exams: 0
    };
    
    addDepartmentMutation.mutate(newDepartment);
  };

  const handleEditDepartment = (departmentId: string) => {
    toast({
      title: "Modification de filière",
      description: `Modification de la filière ${departmentId} en cours de développement.`,
    });
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
      deleteDepartmentMutation.mutate(departmentId);
    }
  };

  const handleAddLevel = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    if (department) {
      const newLevel = prompt("Entrez le nom du niveau (ex: L1, M2):");
      if (newLevel && !department.levels.includes(newLevel)) {
        const updatedDepartment = {
          ...department,
          levels: [...department.levels, newLevel]
        };
        updateDepartmentMutation.mutate(updatedDepartment);
      }
    }
  };

  // If no departments exist, let's create some initial data
  useEffect(() => {
    const initializeDepartments = async () => {
      if (!isLoading && departments.length === 0) {
        const initialDepartments = [
          {
            name: "Génie Logiciel",
            short_name: "GL",
            levels: ["L1", "L2", "L3", "M1", "M2"],
            students: 110,
            exams: 2
          },
          {
            name: "Informatique de Management",
            short_name: "IM",
            levels: ["L2", "L3"],
            students: 60,
            exams: 2
          },
          {
            name: "Systèmes d'Information",
            short_name: "SI",
            levels: ["L3", "M1", "M2"],
            students: 40,
            exams: 1
          }
        ];
        
        for (const dept of initialDepartments) {
          await supabase.from('departments').insert([dept]);
        }
        
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      }
    };
    
    initializeDepartments();
  }, [isLoading, departments.length, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col min-h-screen transition-all duration-300 ease-spring" 
           style={{ marginLeft: sidebarExpanded ? '16rem' : '5rem' }}>
        <Header 
          sidebarExpanded={sidebarExpanded} 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 px-6 py-8 animate-in slide-in-from-top">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <School className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Gestion des Filières</h1>
            </div>
            <Button onClick={handleAddDepartment}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une filière
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher une filière..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDepartments.map((department) => (
                <Card key={department.id} className="animate-in slide-in-from-top delay-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          {department.id}
                        </p>
                        <CardTitle className="mt-1">{department.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Code: {department.short_name}
                        </p>
                      </div>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        <School className="w-5 h-5" />
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{department.students} étudiants</span>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Niveaux disponibles:</p>
                        <div className="flex flex-wrap gap-2">
                          {department.levels.map((level) => (
                            <span 
                              key={level} 
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                            >
                              {level}
                            </span>
                          ))}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-md h-6 px-2.5 text-xs" 
                            onClick={() => handleAddLevel(department.id)}
                          >
                            <PlusCircle className="w-3 h-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <span className="text-sm">
                          {department.exams} examens programmés
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditDepartment(department.id)}>
                            <FileEdit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDepartment(department.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredDepartments.length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Aucune filière trouvée.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Departments;
