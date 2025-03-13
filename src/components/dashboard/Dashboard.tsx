
import { Calendar, Layout, Users, BookOpen, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { ExamCard } from '../common/ExamCard';
import { RoomCard } from '../common/RoomCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  className,
  linkTo
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  description?: string;
  className?: string;
  linkTo?: string;
}) => {
  const CardWrapper = linkTo ? Link : 'div';
  
  return (
    <CardWrapper to={linkTo || '#'} className={className}>
      <Card className={linkTo ? 'hover:border-primary/50 transition-colors' : ''}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export const Dashboard = () => {
  // Dummy data for demonstration
  const stats = [
    {
      title: "Examens prévus",
      value: "8",
      icon: BookOpen,
      description: "Pour la session en cours",
      linkTo: "/exam-management"
    },
    {
      title: "Salles disponibles",
      value: "5",
      icon: Layout,
      description: "Avec 410 places au total",
      linkTo: "/room-management"
    },
    {
      title: "Filières & Promotions",
      value: "7",
      icon: Users,
      description: "Réparties sur 5 filières",
      linkTo: "/departments"
    },
    {
      title: "Planning généré",
      value: "100%",
      icon: Check,
      description: "Tous les examens sont planifiés",
      linkTo: "/schedule"
    },
  ];

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
  ];

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
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-top">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            linkTo={stat.linkTo}
            className="animate-in slide-in-from-top delay-100"
          />
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Examens</h2>
          <Link 
            to="/exam-management" 
            className="text-sm text-primary hover:underline"
          >
            Voir tous
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {exams.map((exam, index) => (
            <Link key={index} to="/exam-management">
              <ExamCard
                {...exam}
                className="animate-in slide-in-from-top delay-200 hover:border-primary/50 transition-colors"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Salles</h2>
          <Link 
            to="/room-management" 
            className="text-sm text-primary hover:underline"
          >
            Voir toutes
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, index) => (
            <Link key={index} to="/room-management">
              <RoomCard
                {...room}
                className="animate-in slide-in-from-top delay-300 hover:border-primary/50 transition-colors"
              />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Card className="animate-in slide-in-from-top delay-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Prochaines étapes</CardTitle>
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Vérifier les contraintes de planning</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assurez-vous que toutes les contraintes sont correctement définies avant de générer le planning.
                  </p>
                  <div className="mt-2">
                    <Link to="/departments">
                      <Button variant="outline" size="sm">
                        Gérer les filières
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Générer le planning</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Utilisez l'algorithme d'optimisation pour générer un planning optimal des examens.
                  </p>
                  <div className="mt-2">
                    <Link to="/schedule">
                      <Button variant="outline" size="sm">
                        Aller au planning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Vérifier les conflits potentiels</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Examinez les conflits potentiels et résolvez-les manuellement si nécessaire.
                  </p>
                  <div className="mt-2">
                    <Link to="/schedule">
                      <Button variant="outline" size="sm">
                        Vérifier les conflits
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
