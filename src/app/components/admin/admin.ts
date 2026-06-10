import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { Team } from '../../models/team';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  teams: Team[] = [];
  
  // Summary stats
  totalTeams = 0;
  activeTeams = 0;
  inactiveTeams = 0;

  // New team form
  newTeamName = '';
  newTeamCode = '';
  newTeamGroup = 'Group A';

  groups = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'];

  editingTeamId: string | null = null;
  editTeamName = '';
  editTeamCode = '';
  editTeamGroup = '';

  constructor(private pollService: PollService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.pollService.getTeams().subscribe({
      next: (t) => {
        this.teams = t;
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load teams', err);
      }
    });
  }

  calculateStats() {
    this.totalTeams = this.teams.length;
    this.activeTeams = this.teams.filter(t => t.status === 'Active').length;
    this.inactiveTeams = this.teams.filter(t => t.status === 'Inactive').length;
  }

  saveTeam() {
    if (!this.newTeamName || !this.newTeamCode || !this.newTeamGroup) return;
    
    const newTeam = {
      code: this.newTeamCode,
      name: this.newTeamName,
      group: this.newTeamGroup,
      status: 'Active'
    };

    this.pollService.addTeam(newTeam as Team).subscribe({
      next: () => {
        this.loadTeams();
        // Reset form
        this.newTeamName = '';
        this.newTeamCode = '';
        this.newTeamGroup = 'Group A';
      },
      error: (err) => {
        console.error('Failed to add team', err);
        alert(err.error?.title || err.error?.message || err.message || 'Failed to add team');
      }
    });
  }

  startEdit(team: Team) {
    this.editingTeamId = team.id;
    this.editTeamName = team.name;
    this.editTeamCode = team.code;
    this.editTeamGroup = team.group;
  }

  cancelEdit() {
    this.editingTeamId = null;
  }

  saveEdit(team: Team) {
    if (!this.editTeamName || !this.editTeamCode || !this.editTeamGroup) return;

    const updatedTeam = { ...team, name: this.editTeamName, code: this.editTeamCode, group: this.editTeamGroup } as Team;
    this.pollService.updateTeam(team.id, updatedTeam).subscribe({
      next: () => {
        this.loadTeams();
        this.editingTeamId = null;
      },
      error: (err) => console.error('Failed to update team', err)
    });
  }

  toggleTeamStatus(team: Team) {
    const updatedTeam = { ...team, status: team.status === 'Active' ? 'Inactive' : 'Active' } as Team;
    this.pollService.updateTeam(team.id, updatedTeam).subscribe({
      next: () => this.loadTeams(),
      error: (err) => console.error('Failed to update status', err)
    });
  }

  deleteTeam(team: Team) {
    if (confirm(`Are you sure you want to delete ${team.name}?`)) {
      this.pollService.deleteTeam(team.id).subscribe({
        next: () => this.loadTeams(),
        error: (err) => {
          alert(err.error?.message || 'Failed to delete team.');
        }
      });
    }
  }
}
