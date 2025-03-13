
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { ExamCard } from '@/components/common/ExamCard';
import { ExamFormModal, ExamFormData } from '@/components/common/ExamFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search, Filter, FileEdit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExamManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamFormData | undefined>(undefined);
  const [exams, setExams] = useState<ExamFormData[]>([
    {
      id: "E1",
      title: "Algorithmes et Programmation",
      duration: 2,
      departments: ["GL-L1"],
      students: 50,
    },
    {
      id: "E2",
      title: "Structures de Données",
      duration: 3,
      departments: ["GL-L1"],
      students: 50,
    },
    {
      id: "E3",
      title: "Bases de Données",
      duration: 2,
      departments: ["IM-L2"],
      students: 60,
    },
    {
      id: "E4",
      title: "Architecture Logicielle",
      duration: 3,
      departments: ["GL-L2", "IM-L2"],
      students: 120,
    },
    {
      id: "E5",
      title: "Systèmes d'Information",
      duration: 2,
      departments: ["SI-L3"],
      students: 40,
    },
    {
      id: "E6",
      title: "Intelligence Artificielle",
      duration: 3,
      departments: ["IA-M1"],
      students: 30,
    },
    {
      id: "E7",
      title: "IoT et Systèmes Embarqués",
      duration: 2,
      departments: ["SEIOT-L3"],
      students: 35,
    },
    {
      id: "E8",
      title: "Robotique et IA",
      duration: 3,
      departments: ["SIRI-M2"],
      students: 25,
    },
  ]);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

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
    setExams(exams.filter(e => e.id !== examId));
    toast({
      title: "Examen supprimé",
      description: `L'examen ${examId} a été supprimé avec succès.`,
    });
  };

  const handleFormSubmit = (data: ExamFormData) => {
    if (isEditing && currentExam?.id) {
      // Mise à jour d'un examen existant
      setExams(exams.map(e => e.id === currentExam.id ? { ...data, id: currentExam.id } : e));
      toast({
        title: "Examen mis à jour",
        description: `L'examen ${currentExam.id} a été mis à jour avec succès.`,
      });
    } else {
      // Ajout d'un nouvel examen
      const newId = `E${exams.length + 1}`;
      setExams([...exams, { ...data, id: newId }]);
      toast({
        title: "Examen ajouté",
        description: `L'examen ${newId} a été ajouté avec succès.`,
      });
    }
    setIsModalOpen(false);
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
            {filteredExams.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Aucun examen trouvé.
              </div>
            )}
          </div>
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
