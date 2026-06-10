export interface Team {
  id: string;
  code: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface Poll {
  userId: string;
  teamId: string;
  castAt: Date;
  team?: Team;
}
