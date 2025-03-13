
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, Filter, UserPlus, Trash2, FileEdit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Student {
  id: string;
  name: string;
  department: string;
  level: string;
  examsTaken: number;
  totalExams: number;
}

const Students = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Données fictives pour les étudiants
  const students: Student[] = [
    {
      id: "STD001",
      name: "Thomas Durand",
      department: "GL",
      level: "L1",
      examsTaken: 1,
      totalExams: 2
    },
    {
      id: "STD002",
      name: "Marie Leclerc",
      department: "GL",
      level: "L2",
      examsTaken: 0,
      totalExams: 1
    },
    {
      id: "STD003",
      name: "Jean Moreau",
      department: "IM",
      level: "L2",
      examsTaken: 1,
      totalExams: 2
    },
    {
      id: "STD004",
      name: "Sophie Martin",
      department: "SI",
      level: "L3",
      examsTaken: 0,
      totalExams: 1
    },
    {
      id: "STD005",
      name: "Pierre Lambert",
      department: "IA",
      level: "M1",
      examsTaken: 1,
      totalExams: 1
    },
    {
      id: "STD006",
      name: "Lucie Bernard",
      department: "SEIOT",
      level: "L3",
      examsTaken: 0,
      totalExams: 1
    },
    {
      id: "STD007",
      name: "Matthieu Petit",
      department: "SIRI",
      level: "M2",
      examsTaken: 0,
      totalExams: 1
    }
  ];

  const departments = [...new Set(students.map(student => student.department))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout d'étudiant sera bientôt disponible.",
    });
  };

  const handleEditStudent = (studentId: string) => {
    toast({
      title: "Modification d'étudiant",
      description: `Modification de l'étudiant ${studentId} en cours de développement.`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    toast({
      title: "Suppression d'étudiant",
      description: `Étudiant ${studentId} supprimé avec succès.`,
    });
  };

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
                          <span>{student.examsTaken} sur {student.totalExams}</span>
                          <span>{Math.round((student.examsTaken/student.totalExams) * 100)}%</span>
                        </div>
                        <Progress value={(student.examsTaken/student.totalExams) * 100} className="h-2" />
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
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun étudiant trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Students;
