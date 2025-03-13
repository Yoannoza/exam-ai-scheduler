
import { LayoutGrid, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  name: string;
  capacity: number;
  availability: number; // Percentage of availability
  className?: string;
}

export const RoomCard = ({ 
  name, 
  capacity, 
  availability,
  className 
}: RoomCardProps) => {
  return (
    <Card className={cn("h-full", className)} hover>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
          </div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <LayoutGrid className="w-5 h-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Capacité: {capacity} places</span>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">
              Disponibilité: {availability}%
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${availability}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
