
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, UserPlus, Trash2, FileEdit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Student {
  id: string;
  name: string;
  department: string;
  level: string;
  exams_taken: number;
  total_exams: number;
}

const Students = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Fetch students from Supabase
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*');
        
      if (error) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les étudiants: ${error.message}`,
          variant: "destructive"
        });
        return [];
      }
      
      return data as Student[];
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (newStudent: Omit<Student, 'id'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([newStudent])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Étudiant ajouté",
        description: "L'étudiant a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter l'étudiant: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (student: Student) => {
      const { id, ...studentData } = student;
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Étudiant mis à jour",
        description: "L'étudiant a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'étudiant: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
        
      if (error) throw error;
      return studentId;
    },
    onSuccess: (studentId) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Étudiant supprimé",
        description: "L'étudiant a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'étudiant: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const departments = [...new Set(students.map(student => student.department))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = () => {
    // This would typically open a modal for adding a student
    // For now, we'll add a sample student
    const newStudent = {
      name: "Nouvel Étudiant",
      department: "GL",
      level: "L1",
      exams_taken: 0,
      total_exams: 2
    };
    
    addStudentMutation.mutate(newStudent);
  };

  const handleEditStudent = (studentId: string) => {
    toast({
      title: "Modification d'étudiant",
      description: `Modification de l'étudiant ${studentId} en cours de développement.`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleFilterChange = (department: string) => {
    setSelectedDepartment(selectedDepartment === department ? null : department);
  };

  // If no students exist, let's create some initial data
  useEffect(() => {
    const initializeStudents = async () => {
      if (!isLoading && students.length === 0) {
        const initialStudents = [
          {
            name: "Thomas Durand",
            department: "GL",
            level: "L1",
            exams_taken: 1,
            total_exams: 2
          },
          {
            name: "Marie Leclerc",
            department: "GL",
            level: "L2",
            exams_taken: 0,
            total_exams: 1
          },
          {
            name: "Jean Moreau",
            department: "IM",
            level: "L2",
            exams_taken: 1,
            total_exams: 2
          },
          {
            name: "Sophie Martin",
            department: "SI",
            level: "L3",
            exams_taken: 0,
            total_exams: 1
          }
        ];
        
        for (const student of initialStudents) {
          await supabase.from('students').insert([student]);
        }
        
        queryClient.invalidateQueries({ queryKey: ['students'] });
      }
    };
    
    initializeStudents();
  }, [isLoading, students.length, queryClient]);

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
              <Users className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Gestion des Étudiants</h1>
            </div>
            <Button onClick={handleAddStudent}>
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un étudiant
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher un étudiant..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {departments.map((department) => (
                    <Button
                      key={department}
                      variant={selectedDepartment === department ? "default" : "outline"}
                      onClick={() => handleFilterChange(department)}
                      className="whitespace-nowrap"
                    >
                      {department}
                    </Button>
                  ))}
                  {selectedDepartment && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedDepartment(null)}
                      className="whitespace-nowrap"
                    >
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Filière</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Niveau</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Examens</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">{student.id}</td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {student.department}-{student.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">{student.level}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{student.exams_taken} sur {student.total_exams}</span>
                            <span>{Math.round((student.exams_taken/student.total_exams) * 100)}%</span>
                          </div>
                          <Progress value={(student.exams_taken/student.total_exams) * 100} className="h-2" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditStudent(student.id)}>
                            <FileEdit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Aucun étudiant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Students;
