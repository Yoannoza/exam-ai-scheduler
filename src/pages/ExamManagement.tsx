
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { ExamCard } from '@/components/common/ExamCard';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';

const ExamManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Dummy data for demonstration
  const exams = [
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
  ];

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
            <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un examen
            </button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Rechercher un examen..." 
                    className="pl-10 h-10 w-full rounded-lg bg-background border border-input text-sm focus:ring-1 focus:ring-primary focus-visible:outline-none"
                  />
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-lg hover:bg-accent transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exams.map((exam, index) => (
              <ExamCard
                key={index}
                {...exam}
                className="animate-in slide-in-from-top delay-100"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamManagement;
