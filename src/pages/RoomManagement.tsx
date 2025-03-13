
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/common/Card';
import { RoomCard } from '@/components/common/RoomCard';
import { RoomFormModal, RoomFormData } from '@/components/common/RoomFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout, Plus, Search, Trash2, FileEdit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const RoomManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomFormData | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  
  // Fetch rooms from Supabase
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*');
        
      if (error) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les salles: ${error.message}`,
          variant: "destructive"
        });
        return [];
      }
      
      return data.map(room => ({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        availability: room.availability,
        restrictions: room.restrictions as RoomFormData['restrictions']
      }));
    },
  });

  // Add room mutation
  const addRoomMutation = useMutation({
    mutationFn: async (newRoom: Omit<RoomFormData, 'id'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert([newRoom])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Salle ajoutée",
        description: "La salle a été ajoutée avec succès.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter la salle: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update room mutation
  const updateRoomMutation = useMutation({
    mutationFn: async (updatedRoom: RoomFormData) => {
      const { id, ...roomData } = updatedRoom;
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Salle mise à jour",
        description: "La salle a été mise à jour avec succès.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la salle: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);
        
      if (error) throw error;
      return roomId;
    },
    onSuccess: (roomId) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Salle supprimée",
        description: "La salle a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la salle: ${error.message}`,
        variant: "destructive"
      });
    }
  });

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
    if (confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  const handleFormSubmit = (data: RoomFormData) => {
    if (isEditing && currentRoom?.id) {
      updateRoomMutation.mutate({ ...data, id: currentRoom.id });
    } else {
      addRoomMutation.mutate(data);
    }
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
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
              {filteredRooms.length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Aucune salle trouvée.
                </div>
              )}
            </div>
          )}
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
