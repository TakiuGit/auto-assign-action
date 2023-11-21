import * as core from '@actions/core'
import { Context } from '@actions/github/lib/context'
import { Client } from './types'

export class PullRequest {
  private client: Client
  private context: Context

  constructor(client: Client, context: Context) {
    this.client = client
    this.context = context
  }

  async addReviewers(reviewers: string[]): Promise<void> {
    reviewers.forEach(console.log)
    const user_reviewers = reviewers.filter((p) => !p.includes('/'))
    const team_reviewers = reviewers
      .filter((p) => p.includes('/'))
      .map((p) => p.split('/')[1])
    user_reviewers.forEach(console.log)
    team_reviewers.forEach(console.log)
    const { owner, repo, number: pull_number } = this.context.issue
    const result = await this.client.rest.pulls.requestReviewers({
      owner,
      repo,
      pull_number,
      user_reviewers,
      team_reviewers,
    })
    core.debug(JSON.stringify(result))
  }

  async addAssignees(assignees: string[]): Promise<void> {
    const { owner, repo, number: issue_number } = this.context.issue
    const result = await this.client.rest.issues.addAssignees({
      owner,
      repo,
      issue_number,
      assignees,
    })
    core.debug(JSON.stringify(result))
  }

  hasAnyLabel(labels: string[]): boolean {
    if (!this.context.payload.pull_request) {
      return false
    }
    const { labels: pullRequestLabels = [] } = this.context.payload.pull_request
    return pullRequestLabels.some((label) => labels.includes(label.name))
  }
}
