
import { BookOpen, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { cn } from '@/lib/utils';

interface ExamCardProps {
  id: string;
  title: string;
  duration: number;
  departments: string[];
  students: number;
  className?: string;
}

export const ExamCard = ({ 
  id, 
  title, 
  duration, 
  departments,
  students,
  className 
}: ExamCardProps) => {
  return (
    <Card className={cn("h-full", className)} hover>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {id}
            </p>
            <h3 className="font-semibold text-lg mt-1">{title}</h3>
          </div>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-5 h-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{duration} {duration > 1 ? 'heures' : 'heure'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{students} étudiants</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {departments.map((dept, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
