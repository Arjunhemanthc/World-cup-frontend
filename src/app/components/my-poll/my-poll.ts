import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { Team, Poll } from '../../models/team';

@Component({
  selector: 'app-my-poll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-poll.html',
  styleUrls: ['./my-poll.css']
})
export class MyPollComponent implements OnInit {
  userPoll: Poll | undefined;
  votedTeam: Team | undefined;
  
  isRevealed = false;
  totalVotes = 0;
  winner: Team | undefined;
  voteBreakdown: any[] = [];

  constructor(
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pollService.getUserPoll().subscribe(poll => {
      if (poll) {
        this.userPoll = poll;
        this.votedTeam = poll.team;
      }
    });

    this.pollService.getResults().subscribe({
      next: (res) => {
        this.isRevealed = res.isRevealed;
        this.totalVotes = res.totalVotes || 0;
        this.winner = res.winner;
        this.voteBreakdown = res.voteBreakdown || [];
      },
      error: (err) => {
        console.error('Error fetching results:', err);
      }
    });
  }

  goToTeams() {
    this.router.navigate(['/user/dashboard']);
  }
}
