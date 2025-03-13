
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { RoomCard } from '@/components/common/RoomCard';
import { RoomFormModal, RoomFormData } from '@/components/common/RoomFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout, Plus, Search, Filter, FileEdit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomFormData | undefined>(undefined);
  const [rooms, setRooms] = useState<RoomFormData[]>([
    {
      id: "R1",
      name: "IRAN2",
      capacity: 100,
      availability: 100,
    },
    {
      id: "R2",
      name: "Padtice",
      capacity: 80,
      availability: 100,
    },
    {
      id: "R3",
      name: "IRAN1",
      capacity: 60,
      availability: 80,
      restrictions: {
        specificDays: ['Jour 1', 'Jour 2']
      }
    },
    {
      id: "R4",
      name: "SOKPON",
      capacity: 120,
      availability: 87,
    },
    {
      id: "R5",
      name: "Zone Master A2",
      capacity: 50,
      availability: 60,
      restrictions: {
        afternoonOnly: true
      }
    },
  ]);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = !capacityFilter || room.capacity >= capacityFilter;
    return matchesSearch && matchesCapacity;
  });

  const handleAddRoom = () => {
    setIsEditing(false);
    setCurrentRoom(undefined);
    setIsModalOpen(true);
  };

  const handleEditRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
    toast({
      title: "Salle supprimée",
      description: `La salle ${roomId} a été supprimée avec succès.`,
    });
  };

  const handleFormSubmit = (data: RoomFormData) => {
    if (isEditing && currentRoom?.id) {
      // Mise à jour d'une salle existante
      setRooms(rooms.map(r => r.id === currentRoom.id ? { ...data, id: currentRoom.id } : r));
      toast({
        title: "Salle mise à jour",
        description: `La salle ${currentRoom.id} a été mise à jour avec succès.`,
      });
    } else {
      // Ajout d'une nouvelle salle
      const newId = `R${rooms.length + 1}`;
      setRooms([...rooms, { ...data, id: newId }]);
      toast({
        title: "Salle ajoutée",
        description: `La salle ${data.name} a été ajoutée avec succès.`,
      });
    }
    setIsModalOpen(false);
  };

  const capacityFilters = [50, 80, 100];

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
            <Button onClick={handleAddRoom}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une salle
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher une salle..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {capacityFilters.map((capacity) => (
                    <Button
                      key={capacity}
                      variant={capacityFilter === capacity ? "default" : "outline"}
                      onClick={() => setCapacityFilter(capacityFilter === capacity ? null : capacity)}
                      className="whitespace-nowrap"
                    >
                      {capacity}+ places
                    </Button>
                  ))}
                  {capacityFilter && (
                    <Button
                      variant="ghost"
                      onClick={() => setCapacityFilter(null)}
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
            {filteredRooms.map((room) => (
              <div key={room.id} className="relative group">
                <RoomCard
                  name={room.name}
                  capacity={room.capacity}
                  availability={room.availability}
                  className="animate-in slide-in-from-top delay-100"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room.id || '')}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id || '')}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredRooms.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                Aucune salle trouvée.
              </div>
            )}
          </div>
        </main>
      </div>

      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentRoom}
        isEditing={isEditing}
      />
    </div>
  );
};

export default RoomManagement;
