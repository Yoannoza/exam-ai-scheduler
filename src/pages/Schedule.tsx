
import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Calendar, Download, RotateCcw, Check, AlertTriangle } from 'lucide-react';

const Schedule = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Dummy data for the schedule
  const days = ["Jour 1", "Jour 2", "Jour 3"];
  const timeSlots = ["8h-10h", "10h-12h", "13h-15h", "15h-17h", "17h-19h"];
  
  const schedule = {
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
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-input rounded-lg hover:bg-accent transition-colors">
                <RotateCcw className="w-4 h-4 mr-2" />
                Regénérer
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
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
                            className="mb-2 p-2 rounded-lg bg-primary/10 text-primary border border-primary/20"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.exam}</span>
                              <span className="text-xs">{item.room}</span>
                            </div>
                            <div className="mt-1 text-xs">
                              {item.departments.join(", ")}
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
    </div>
  );
};

export default Schedule;
