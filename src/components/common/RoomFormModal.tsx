
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

export interface RoomFormData {
  id?: string;
  name: string;
  capacity: number;
  availability: number;
  restrictions?: {
    morningOnly?: boolean;
    afternoonOnly?: boolean;
    specificDays?: string[];
  };
}

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoomFormData) => void;
  initialData?: RoomFormData;
  isEditing?: boolean;
}

export const RoomFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}: RoomFormModalProps) => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    capacity: 0,
    availability: 100,
    restrictions: {
      morningOnly: false,
      afternoonOnly: false,
      specificDays: []
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        capacity: 0,
        availability: 100,
        restrictions: {
          morningOnly: false,
          afternoonOnly: false,
          specificDays: []
        }
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleRestrictionChange = (key: 'morningOnly' | 'afternoonOnly', checked: boolean) => {
    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        [key]: checked,
        ...(key === 'morningOnly' && checked ? { afternoonOnly: false } : {}),
        ...(key === 'afternoonOnly' && checked ? { morningOnly: false } : {})
      }
    });
  };

  const handleDayToggle = (day: string) => {
    const currentDays = formData.restrictions?.specificDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        specificDays: newDays
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const days = ['Jour 1', 'Jour 2', 'Jour 3'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier la salle' : 'Ajouter une salle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom de la salle"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacité
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Nombre de places"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">
                Disponibilité (%)
              </Label>
              <Input
                id="availability"
                name="availability"
                type="number"
                min={0}
                max={100}
                value={formData.availability}
                onChange={handleChange}
                placeholder="Pourcentage de disponibilité"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Restrictions
              </Label>
              <div className="col-span-3 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="morningOnly" 
                    checked={formData.restrictions?.morningOnly} 
                    onCheckedChange={(checked) => handleRestrictionChange('morningOnly', checked as boolean)}
                  />
                  <Label htmlFor="morningOnly">Disponible uniquement le matin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="afternoonOnly" 
                    checked={formData.restrictions?.afternoonOnly} 
                    onCheckedChange={(checked) => handleRestrictionChange('afternoonOnly', checked as boolean)}
                  />
                  <Label htmlFor="afternoonOnly">Disponible uniquement l'après-midi</Label>
                </div>
                <div className="space-y-2">
                  <Label>Jours disponibles:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {days.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`} 
                          checked={formData.restrictions?.specificDays?.includes(day)} 
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={`day-${day}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
