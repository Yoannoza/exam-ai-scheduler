
import { supabase } from '@/integrations/supabase/client';

const API_URL = 'http://localhost:8000'; // Replace with your actual FastAPI server URL

export interface ScheduleItem {
  examen: string;
  salle: string;
  creneau: number;
}

export interface ApiSalleFormat {
  [key: string]: number; // Room name -> capacity
}

export interface ApiFilieresPromotionsFormat {
  [key: string]: string[]; // "filiere,niveau" -> exam IDs
}

export interface ApiDisponibilitesFormat {
  [key: string]: number; // "salle,creneau" -> availability (0 or 1)
}

// Transform our Supabase data to match the API's expected format
export const transformDataForApi = async () => {
  try {
    // Fetch rooms from Supabase
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) throw roomsError;
    
    // Fetch exams from Supabase
    const { data: examsData, error: examsError } = await supabase
      .from('exams')
      .select('*');
    
    if (examsError) throw examsError;
    
    // Fetch departments from Supabase
    const { data: departmentsData, error: departmentsError } = await supabase
      .from('departments')
      .select('*');
    
    if (departmentsError) throw departmentsError;
    
    // Transform rooms data to API format
    const salles: ApiSalleFormat = {};
    roomsData.forEach(room => {
      salles[room.name] = room.capacity;
    });
    
    // Transform exams data to match API format
    const examens = examsData.map(exam => exam.id);
    
    // Create filières_promotions format
    const filières_promotions: ApiFilieresPromotionsFormat = {};
    examsData.forEach(exam => {
      exam.departments.forEach(dept => {
        if (!filières_promotions[dept]) {
          filières_promotions[dept] = [];
        }
        filières_promotions[dept].push(exam.id);
      });
    });
    
    // Create disponibilites format (simplified version)
    const disponibilites: ApiDisponibilitesFormat = {};
    const creneaux = Array.from({ length: 15 }, (_, i) => i); // 0-14 timeslots
    
    roomsData.forEach(room => {
      creneaux.forEach(t => {
        // For simplicity, we're using the availability percentage as a boolean
        // More advanced logic could be implemented based on restrictions
        const isAvailable = room.availability > 0 ? 1 : 0;
        disponibilites[`${room.name},${t}`] = isAvailable;
      });
    });
    
    return {
      examens,
      salles,
      filières_promotions,
      disponibilites
    };
  } catch (error) {
    console.error('Error transforming data for API:', error);
    throw error;
  }
};

// Function to generate schedule
export const generateSchedule = async (): Promise<ScheduleItem[]> => {
  try {
    const response = await fetch(`${API_URL}/generate_schedule/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate schedule');
    }
    
    const data = await response.json();
    return data.schedule;
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw error;
  }
};

// Function to update examens in the API
export const updateExamens = async (examens: string[]) => {
  try {
    const response = await fetch(`${API_URL}/update_examens/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ examens }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update examens');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating examens:', error);
    throw error;
  }
};

// Function to update salles in the API
export const updateSalles = async (salles: ApiSalleFormat) => {
  try {
    const response = await fetch(`${API_URL}/update_salles/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ salles }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update salles');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating salles:', error);
    throw error;
  }
};

// Function to update filières_promotions in the API
export const updateFilieresPromotions = async (filières_promotions: ApiFilieresPromotionsFormat) => {
  try {
    const response = await fetch(`${API_URL}/update_filières_promotions/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filières_promotions }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update filières_promotions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating filières_promotions:', error);
    throw error;
  }
};

// Function to update disponibilites in the API
export const updateDisponibilites = async (disponibilites: ApiDisponibilitesFormat) => {
  try {
    const response = await fetch(`${API_URL}/update_disponibilites/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disponibilites }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update disponibilites');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating disponibilites:', error);
    throw error;
  }
};

// Sync all data to the API
export const syncAllDataToApi = async () => {
  try {
    const transformedData = await transformDataForApi();
    
    await updateExamens(transformedData.examens);
    await updateSalles(transformedData.salles);
    await updateFilieresPromotions(transformedData.filières_promotions);
    await updateDisponibilites(transformedData.disponibilites);
    
    return { success: true, message: 'All data synchronized with the API' };
  } catch (error) {
    console.error('Error syncing data to API:', error);
    throw error;
  }
};
