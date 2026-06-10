export interface Team {
  id: string;
  code: string;
  name: string;
  group: string;
  status: 'Active' | 'Inactive';
}

export interface Poll {
  userId: string;
  teamId: string;
  castAt: Date;
  team?: Team;
}
