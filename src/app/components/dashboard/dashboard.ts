import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PollService } from '../../services/poll.service';
import { Team, Poll } from '../../models/team';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];

  // Pagination
  pageSize = 6;
  currentPage = 1;
  totalPages = 1;
  paginatedTeams: Team[] = [];

  selectedTeam: Team | null = null;
  userPoll: Poll | undefined;
  votedTeam: Team | undefined;
  isRevealed = false;

  // Results state
  winner: Team | undefined;
  voteBreakdown: any[] = [];

  constructor(
    public authService: AuthService,
    private pollService: PollService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }

    this.pollService.getTeams().subscribe({
      next: (t) => {
        const teamArray = Array.isArray(t) ? t : [];
        this.teams = teamArray.filter(team => team && team.status === 'Active');
        this.initializeTeams();
        this.cdr.detectChanges();
        
        this.pollService.getUserPoll().subscribe({
          next: (poll) => {
            if (poll) {
              this.userPoll = poll;
              this.votedTeam = poll.team || this.teams.find(team => team.id === poll.teamId);
              this.cdr.detectChanges();
            }
          },
          error: (err) => console.error('Error loading user poll:', err)
        });
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.initializeTeams(); // fallback to empty
      }
    });
  }

  initializeTeams() {
    this.filteredTeams = [...this.teams];
    
    this.totalPages = Math.ceil(this.filteredTeams.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedTeams = this.filteredTeams.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  selectTeam(team: Team) {
    if (this.userPoll) return; // Prevent selection if already voted
    this.selectedTeam = team;
  }

  submitVote() {
    if (!this.selectedTeam) return;

    this.pollService.submitPoll(this.selectedTeam.id).subscribe({
      next: (res) => {
        this.userPoll = res.poll;
        this.votedTeam = this.teams.find(t => t.id === this.userPoll!.teamId);
        this.selectedTeam = null;
      },
      error: (err) => {
        alert(err.error?.message || 'Error submitting vote');
      }
    });
  }
}
