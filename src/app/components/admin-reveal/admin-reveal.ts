import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { Team } from '../../models/team';

@Component({
  selector: 'app-admin-reveal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-reveal.html',
  styleUrls: ['./admin-reveal.css']
})
export class AdminRevealComponent implements OnInit {
  teams: Team[] = [];
  selectedTeamId: string = '';
  selectedTeamStats: any = null;
  isRevealed = false;
  allStats: any;

  constructor(private pollService: PollService, private router: Router) {}

  ngOnInit() {
    this.pollService.getTeams().subscribe(t => {
      this.teams = t;
    });

    this.pollService.getResults().subscribe({
      next: (res) => {
        this.isRevealed = res.isRevealed;
        if (this.isRevealed && res.winner) {
          this.selectedTeamId = res.winner.id;
        }
      },
      error: () => {
        this.isRevealed = false;
      }
    });

    this.pollService.getAdminStats().subscribe(data => {
      this.allStats = data;
    });
  }

  onTeamSelect() {
    if (!this.selectedTeamId || !this.allStats) {
      this.selectedTeamStats = null;
      return;
    }
    const teamStats = this.allStats.votesByTeam.find((s: any) => s.team.id === this.selectedTeamId);
    if (teamStats) {
      this.selectedTeamStats = teamStats;
    } else {
      const team = this.teams.find(t => t.id === this.selectedTeamId);
      this.selectedTeamStats = { team, votes: 0, percentage: 0 };
    }
  }

  revealResult() {
    if (!this.selectedTeamId) return;

    const teamName = this.selectedTeamStats?.team?.name || 'the selected team';
    const isConfirmed = confirm(`WARNING: You are about to officially reveal ${teamName} as the winner. This action CANNOT BE UNDONE. All users will immediately see this result. Are you absolutely sure?`);

    if (!isConfirmed) return;

    this.pollService.revealResults(this.selectedTeamId).subscribe({
      next: () => {
        this.isRevealed = true;
        alert('SUCCESS: Results have been permanently revealed to all users!');
      },
      error: (err) => alert('Failed to reveal results.')
    });
  }

  cancel() {
    this.router.navigate(['/admin/polls']);
  }

  resetPoll() {
    const isConfirmed = confirm('Are you sure you want to start a new poll? This will reset all votes.');
    if (!isConfirmed) return;

    this.pollService.resetPoll().subscribe({
      next: () => {
        alert('SUCCESS: The poll has been completely reset.');
        this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
            window.location.href = '/admin/teams';
        });
      },
      error: (err) => alert('Failed to reset poll.')
    });
  }
}
