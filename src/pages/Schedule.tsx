
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Calendar, Download, RotateCcw, Check, AlertTriangle, FileEdit, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleItem {
  room: string;
  exam: string;
  departments: string[];
}

const Schedule = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [currentConflict, setCurrentConflict] = useState<{exam1: string, exam2: string, reason: string} | null>(null);
  const [exportFormat, setExportFormat] = useState("pdf");
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Dummy data for the schedule
  const days = ["Jour 1", "Jour 2", "Jour 3"];
  const timeSlots = ["8h-10h", "10h-12h", "13h-15h", "15h-17h", "17h-19h"];
  
  const [schedule, setSchedule] = useState<Record<string, Record<string, ScheduleItem[]>>>({
    "Jour 1": {
      "8h-10h": [
        { room: "IRAN2", exam: "E1", departments: ["GL-L1"] },
        { room: "Padtice", exam: "E3", departments: ["IM-L2"] }
      ],
      "10h-12h": [],
      "13h-15h": [
        { room: "IRAN1", exam: "E5", departments: ["SI-L3"] }
      ],
      "15h-17h": [
        { room: "SOKPON", exam: "E4", departments: ["GL-L2", "IM-L2"] }
      ],
      "17h-19h": []
    },
    "Jour 2": {
      "8h-10h": [
        { room: "IRAN2", exam: "E7", departments: ["SEIOT-L3"] }
      ],
      "10h-12h": [],
      "13h-15h": [
        { room: "Zone Master A2", exam: "E6", departments: ["IA-M1"] }
      ],
      "15h-17h": [],
      "17h-19h": [
        { room: "Zone Master A2", exam: "E8", departments: ["SIRI-M2"] }
      ]
    },
    "Jour 3": {
      "8h-10h": [],
      "10h-12h": [
        { room: "IRAN2", exam: "E2", departments: ["GL-L1"] }
      ],
      "13h-15h": [],
      "15h-17h": [],
      "17h-19h": []
    }
  });

  const [conflicts, setConflicts] = useState<{exam1: string, exam2: string, reason: string}[]>([]);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    
    // Simuler un délai d'attente
    setTimeout(() => {
      // Créer une copie du planning avec de légères modifications
      const newSchedule = {...schedule};
      
      // Échanger deux examens
      const temp = newSchedule["Jour 1"]["8h-10h"][0];
      newSchedule["Jour 1"]["8h-10h"][0] = newSchedule["Jour 3"]["10h-12h"][0];
      newSchedule["Jour 3"]["10h-12h"][0] = temp;
      
      setSchedule(newSchedule);
      setIsRegenerating(false);
      
      toast({
        title: "Planning régénéré",
        description: "Le planning a été régénéré avec succès.",
      });
    }, 2000);
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Simuler un délai d'attente
    setTimeout(() => {
      setIsExporting(false);
      setIsExportDialogOpen(false);
      
      toast({
        title: "Planning exporté",
        description: `Le planning a été exporté au format ${exportFormat.toUpperCase()}.`,
      });
    }, 1500);
  };

  const handleEditExam = (day: string, timeSlot: string, examIndex: number) => {
    const exam = schedule[day][timeSlot][examIndex];
    
    toast({
      title: "Modification d'examen",
      description: `Modification de l'examen ${exam.exam} dans la salle ${exam.room} en cours de développement.`,
    });
  };

  const checkForConflicts = () => {
    // Simuler un conflit
    setCurrentConflict({
      exam1: "E1",
      exam2: "E3",
      reason: "Ces examens partagent des étudiants de la filière GL-L1"
    });
    setIsConflictDialogOpen(true);
  };

  const resolveConflict = () => {
    if (currentConflict) {
      toast({
        title: "Conflit résolu",
        description: `Le conflit entre ${currentConflict.exam1} et ${currentConflict.exam2} a été résolu.`,
      });
      setIsConflictDialogOpen(false);
    }
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
              <Calendar className="w-6 h-6 mr-3 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Planning des Examens</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => checkForConflicts()}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Vérifier les conflits
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRegenerate} 
                disabled={isRegenerating}
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Régénération...' : 'Regénérer'}
              </Button>
              <Button 
                onClick={() => setIsExportDialogOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>État du Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-sm">8 examens planifiés sur 8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-sm">0 conflits détectés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">5 salles utilisées sur 5</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Planning validé</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Le planning est valide et respecte toutes les contraintes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-muted/50 border text-left font-medium text-muted-foreground">
                    Créneaux
                  </th>
                  {days.map((day, i) => (
                    <th key={i} className="p-3 bg-muted/50 border text-left font-medium text-muted-foreground">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slotIndex}>
                    <td className="p-3 border bg-muted/30 font-medium">
                      {slot}
                    </td>
                    {days.map((day, dayIndex) => (
                      <td key={dayIndex} className="p-3 border min-w-[200px] h-[120px] align-top">
                        {(schedule[day][slot] || []).map((item, i) => (
                          <div 
                            key={i} 
                            className="mb-2 p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 group relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.exam}</span>
                              <span className="text-xs">{item.room}</span>
                            </div>
                            <div className="mt-1 text-xs">
                              {item.departments.join(", ")}
                            </div>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5" 
                                onClick={() => handleEditExam(day, slot, i)}
                              >
                                <FileEdit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Légende</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20"></div>
                    <span className="text-sm">Examen planifié</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-destructive/10 border border-destructive/20"></div>
                    <span className="text-sm">Conflit détecté</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-muted/50 border"></div>
                    <span className="text-sm">Créneau non disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Dialog de vérification des conflits */}
      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conflit détecté</DialogTitle>
            <DialogDescription>
              Un conflit a été détecté entre les examens suivants:
            </DialogDescription>
          </DialogHeader>
          {currentConflict && (
            <div className="py-4">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                  <p className="font-semibold text-lg">{currentConflict.exam1}</p>
                  <p className="text-sm text-muted-foreground">Jour 1, 8h-10h</p>
                </div>
                <AlertTriangle className="text-destructive" />
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                  <p className="font-semibold text-lg">{currentConflict.exam2}</p>
                  <p className="text-sm text-muted-foreground">Jour 1, 8h-10h</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Raison du conflit: {currentConflict.reason}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConflictDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={resolveConflict}>
              Résoudre automatiquement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'exportation */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter le planning</DialogTitle>
            <DialogDescription>
              Choisissez le format d'exportation pour le planning des examens.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={exportFormat}
                onValueChange={setExportFormat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <Label>Période</Label>
              </div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les jours</SelectItem>
                  <SelectItem value="day1">Jour 1</SelectItem>
                  <SelectItem value="day2">Jour 2</SelectItem>
                  <SelectItem value="day3">Jour 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Exportation...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant Label séparé pour la réutilisation
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export default Schedule;
