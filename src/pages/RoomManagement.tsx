
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { RoomCard } from '@/components/common/RoomCard';
import { Layout, Plus, Search, Filter } from 'lucide-react';

const RoomManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Dummy data for demonstration
  const rooms = [
    {
      name: "IRAN2",
      capacity: 100,
      availability: 100,
    },
    {
      name: "Padtice",
      capacity: 80,
      availability: 100,
    },
    {
      name: "IRAN1",
      capacity: 60,
      availability: 80,
    },
    {
      name: "SOKPON",
      capacity: 120,
      availability: 87,
    },
    {
      name: "Zone Master A2",
      capacity: 50,
      availability: 60,
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
              <Layout className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Gestion des Salles</h1>
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une salle
            </button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Rechercher une salle..." 
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
            {rooms.map((room, index) => (
              <RoomCard
                key={index}
                {...room}
                className="animate-in slide-in-from-top delay-100"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoomManagement;
