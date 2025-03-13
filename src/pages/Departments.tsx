
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, Plus, Search, Users, Trash2, FileEdit, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  shortName: string;
  levels: string[];
  students: number;
  exams: number;
}

const Departments = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Données fictives pour les filières
  const departments: Department[] = [
    {
      id: "DEP001",
      name: "Génie Logiciel",
      shortName: "GL",
      levels: ["L1", "L2", "L3", "M1", "M2"],
      students: 110,
      exams: 2
    },
    {
      id: "DEP002",
      name: "Informatique de Management",
      shortName: "IM",
      levels: ["L2", "L3"],
      students: 60,
      exams: 2
    },
    {
      id: "DEP003",
      name: "Systèmes d'Information",
      shortName: "SI",
      levels: ["L3", "M1", "M2"],
      students: 40,
      exams: 1
    },
    {
      id: "DEP004",
      name: "Intelligence Artificielle",
      shortName: "IA",
      levels: ["M1", "M2"],
      students: 30,
      exams: 1
    },
    {
      id: "DEP005",
      name: "Systèmes Embarqués et IoT",
      shortName: "SEIOT",
      levels: ["L3", "M1"],
      students: 35,
      exams: 1
    },
    {
      id: "DEP006",
      name: "Systèmes Intelligents et Robotique",
      shortName: "SIRI",
      levels: ["M2"],
      students: 25,
      exams: 1
    }
  ];

  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    department.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de filière sera bientôt disponible.",
    });
  };

  const handleEditDepartment = (departmentId: string) => {
    toast({
      title: "Modification de filière",
      description: `Modification de la filière ${departmentId} en cours de développement.`,
    });
  };

  const handleDeleteDepartment = (departmentId: string) => {
    toast({
      title: "Suppression de filière",
      description: `Filière ${departmentId} supprimée avec succès.`,
    });
  };

  const handleAddLevel = (departmentId: string) => {
    toast({
      title: "Ajout de niveau",
      description: `Ajout d'un niveau à la filière ${departmentId} en cours de développement.`,
    });
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
                        Code: {department.shortName}
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
            {filteredDepartments.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Aucune filière trouvée.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Departments;
