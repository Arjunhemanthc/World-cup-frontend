import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { Team } from '../../models/team';

@Component({
  selector: 'app-admin-polls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-polls.html',
  styleUrls: ['./admin-polls.css']
})
export class AdminPollsComponent implements OnInit {
  stats: any;
  votesByTeam: any[] = [];
  recentVotes: any[] = [];

  constructor(private pollService: PollService) {}

  ngOnInit() {
    this.pollService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = {
          totalUsers: data.totalUsers,
          voted: data.voted,
          notVoted: data.notVoted,
          topTeam: data.topTeam
        };
        this.votesByTeam = data.votesByTeam;
        this.recentVotes = data.recentVotes;
      },
      error: (err) => console.error('Error fetching admin stats', err)
    });
  }
}
