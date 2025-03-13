
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ExamFormData {
  id?: string;
  title: string;
  duration: number;
  departments: string[];
  students: number;
}

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExamFormData) => void;
  initialData?: ExamFormData;
  isEditing?: boolean;
}

export const ExamFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}: ExamFormModalProps) => {
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    duration: 2,
    departments: [],
    students: 0
  });
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Liste fictive des départements disponibles
  const departments = [
    { id: 'GL-L1', name: 'GL-L1' },
    { id: 'GL-L2', name: 'GL-L2' },
    { id: 'IM-L2', name: 'IM-L2' },
    { id: 'SI-L3', name: 'SI-L3' },
    { id: 'IA-M1', name: 'IA-M1' },
    { id: 'SEIOT-L3', name: 'SEIOT-L3' },
    { id: 'SIRI-M2', name: 'SIRI-M2' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        duration: 2,
        departments: [],
        students: 0
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' || name === 'students' ? Number(value) : value
    });
  };

  const handleDurationChange = (value: string) => {
    setFormData({
      ...formData,
      duration: Number(value)
    });
  };

  const handleAddDepartment = () => {
    if (selectedDepartment && !formData.departments.includes(selectedDepartment)) {
      setFormData({
        ...formData,
        departments: [...formData.departments, selectedDepartment]
      });
      setSelectedDepartment('');
    }
  };

  const handleRemoveDepartment = (dept: string) => {
    setFormData({
      ...formData,
      departments: formData.departments.filter(d => d !== dept)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier l\'examen' : 'Ajouter un examen'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id || ''}
                  onChange={handleChange}
                  disabled
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Entrez le titre de l'examen"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Durée (h)
              </Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={handleDurationChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="2">2 heures</SelectItem>
                  <SelectItem value="3">3 heures</SelectItem>
                  <SelectItem value="4">4 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="students" className="text-right">
                Étudiants
              </Label>
              <Input
                id="students"
                name="students"
                type="number"
                min={1}
                value={formData.students}
                onChange={handleChange}
                placeholder="Nombre d'étudiants"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Filières
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionnez une filière" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    onClick={handleAddDepartment}
                    disabled={!selectedDepartment}
                  >
                    Ajouter
                  </Button>
                </div>
                {formData.departments.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.departments.map((dept) => (
                      <span 
                        key={dept} 
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {dept}
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(dept)}
                          className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune filière sélectionnée</p>
                )}
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
