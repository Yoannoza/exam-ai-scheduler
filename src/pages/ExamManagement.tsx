
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { ExamCard } from '@/components/common/ExamCard';
import { ExamFormModal, ExamFormData } from '@/components/common/ExamFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search, FileEdit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ExamManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamFormData | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Fetch exams from Supabase
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*');
        
      if (error) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les examens: ${error.message}`,
          variant: "destructive"
        });
        return [];
      }
      
      return data.map(exam => ({
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
        departments: exam.departments,
        students: exam.students
      }));
    },
  });

  // Add exam mutation
  const addExamMutation = useMutation({
    mutationFn: async (newExam: Omit<ExamFormData, 'id'>) => {
      const { data, error } = await supabase
        .from('exams')
        .insert([newExam])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({
        title: "Examen ajouté",
        description: "L'examen a été ajouté avec succès.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter l'examen: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update exam mutation
  const updateExamMutation = useMutation({
    mutationFn: async (updatedExam: ExamFormData) => {
      const { id, ...examData } = updatedExam;
      const { data, error } = await supabase
        .from('exams')
        .update(examData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({
        title: "Examen mis à jour",
        description: "L'examen a été mis à jour avec succès.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'examen: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete exam mutation
  const deleteExamMutation = useMutation({
    mutationFn: async (examId: string) => {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);
        
      if (error) throw error;
      return examId;
    },
    onSuccess: (examId) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({
        title: "Examen supprimé",
        description: "L'examen a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'examen: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (exam.id && exam.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = !selectedDepartment || 
                             (exam.departments && exam.departments.some(dept => dept.includes(selectedDepartment)));
    return matchesSearch && matchesDepartment;
  });

  const handleAddExam = () => {
    setIsEditing(false);
    setCurrentExam(undefined);
    setIsModalOpen(true);
  };

  const handleEditExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setCurrentExam(exam);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet examen ?")) {
      deleteExamMutation.mutate(examId);
    }
  };

  const handleFormSubmit = (data: ExamFormData) => {
    if (isEditing && currentExam?.id) {
      updateExamMutation.mutate({ ...data, id: currentExam.id });
    } else {
      addExamMutation.mutate(data);
    }
  };

  const availableDepartments = Array.from(
    new Set(
      exams.flatMap(exam => exam.departments).filter(Boolean)
    )
  );

  const handleFilterChange = (department: string) => {
    setSelectedDepartment(selectedDepartment === department ? null : department);
  };

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
              <BookOpen className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Gestion des Examens</h1>
            </div>
            <Button onClick={handleAddExam}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un examen
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher un examen..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {availableDepartments.map((department) => (
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="relative group">
                  <ExamCard
                    id={exam.id || ''}
                    title={exam.title}
                    duration={exam.duration}
                    departments={exam.departments}
                    students={exam.students}
                    className="animate-in slide-in-from-top delay-100"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditExam(exam.id || '')}>
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteExam(exam.id || '')}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredExams.length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Aucun examen trouvé.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <ExamFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentExam}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ExamManagement;
