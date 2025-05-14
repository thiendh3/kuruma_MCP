import { z } from "zod";
import { githubRequest } from "../common/utils.js";
import {
  GitHubPullRequestSchema,
  GitHubIssueAssigneeSchema,
  GitHubRepositorySchema,
} from "../common/types.js";

// Schema definitions
export const PullRequestFileSchema = z.object({
  sha: z.string(),
  filename: z.string(),
  status: z.enum(['added', 'removed', 'modified', 'renamed', 'copied', 'changed', 'unchanged']),
  additions: z.number(),
  deletions: z.number(),
  changes: z.number(),
  blob_url: z.string(),
  raw_url: z.string(),
  contents_url: z.string(),
  patch: z.string().optional()
});

export const StatusCheckSchema = z.object({
  url: z.string(),
  state: z.enum(['error', 'failure', 'pending', 'success']),
  description: z.string().nullable(),
  target_url: z.string().nullable(),
  context: z.string(),
  created_at: z.string(),
  updated_at: z.string()
});

export const CombinedStatusSchema = z.object({
  state: z.enum(['error', 'failure', 'pending', 'success']),
  statuses: z.array(StatusCheckSchema),
  sha: z.string(),
  total_count: z.number()
});

export const PullRequestCommentSchema = z.object({
  url: z.string(),
  id: z.number(),
  node_id: z.string(),
  pull_request_review_id: z.number().nullable(),
  diff_hunk: z.string(),
  path: z.string().nullable(),
  position: z.number().nullable(),
  original_position: z.number().nullable(),
  commit_id: z.string(),
  original_commit_id: z.string(),
  user: GitHubIssueAssigneeSchema,
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  html_url: z.string(),
  pull_request_url: z.string(),
  author_association: z.string(),
  _links: z.object({
    self: z.object({ href: z.string() }),
    html: z.object({ href: z.string() }),
    pull_request: z.object({ href: z.string() })
  })
});

export const PullRequestReviewSchema = z.object({
  id: z.number(),
  node_id: z.string(),
  user: GitHubIssueAssigneeSchema,
  body: z.string().nullable(),
  state: z.enum(['APPROVED', 'CHANGES_REQUESTED', 'COMMENTED', 'DISMISSED', 'PENDING']),
  html_url: z.string(),
  pull_request_url: z.string(),
  commit_id: z.string(),
  submitted_at: z.string().nullable(),
  author_association: z.string()
});

// Input schemas
export const CreatePullRequestSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  title: z.string().describe("Pull request title"),
  body: z.string().optional().describe("Pull request body/description"),
  head: z.string().describe("The name of the branch where your changes are implemented"),
  base: z.string().describe("The name of the branch you want the changes pulled into"),
  draft: z.boolean().optional().describe("Whether to create the pull request as a draft"),
  maintainer_can_modify: z.boolean().optional().describe("Whether maintainers can modify the pull request")
});

export const GetPullRequestSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number")
});

export const ListPullRequestsSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  state: z.enum(['open', 'closed', 'all']).optional().describe("State of the pull requests to return"),
  head: z.string().optional().describe("Filter by head user or head organization and branch name"),
  base: z.string().optional().describe("Filter by base branch name"),
  sort: z.enum(['created', 'updated', 'popularity', 'long-running']).optional().describe("What to sort results by"),
  direction: z.enum(['asc', 'desc']).optional().describe("The direction of the sort"),
  per_page: z.number().optional().describe("Results per page (max 100)"),
  page: z.number().optional().describe("Page number of the results")
});

export const CreatePullRequestReviewSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number"),
  commit_id: z.string().optional().describe("The SHA of the commit that needs a review"),
  body: z.string().describe("The body text of the review"),
  event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']).describe("The review action to perform"),
  comments: z.array(
    z.object({
      path: z.string().describe("The relative path to the file being commented on"),
      start_line: z.number().describe("The starting line number in the file to comment on"),
      end_line: z.number().optional().describe("The ending line number in the file to comment on (defaults to start_line if not provided)"),
      start_side: z.enum(['LEFT', 'RIGHT']).optional().describe("Which version of the file to comment on for the start line (LEFT for old version, RIGHT for new version)"),
      end_side: z.enum(['LEFT', 'RIGHT']).optional().describe("Which version of the file to comment on for the end line (LEFT for old version, RIGHT for new version)"),
      body: z.string().describe("Text of the review comment")
    })
  ).optional().describe("Comments to post as part of the review")
});

export const MergePullRequestSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number"),
  commit_title: z.string().optional().describe("Title for the automatic commit message"),
  commit_message: z.string().optional().describe("Extra detail to append to automatic commit message"),
  merge_method: z.enum(['merge', 'squash', 'rebase']).optional().describe("Merge method to use")
});

export const GetPullRequestFilesSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"), 
  pull_number: z.number().describe("Pull request number")
});

export const GetPullRequestStatusSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number")
});

export const UpdatePullRequestBranchSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number"),
  expected_head_sha: z.string().optional().describe("The expected SHA of the pull request's HEAD ref")
});

export const GetPullRequestCommentsSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number")
});

export const GetPullRequestReviewsSchema = z.object({
  owner: z.string().describe("Repository owner (username or organization)"),
  repo: z.string().describe("Repository name"),
  pull_number: z.number().describe("Pull request number")
});

// Function implementations
export async function createPullRequest(
  params: z.infer<typeof CreatePullRequestSchema>
): Promise<z.infer<typeof GitHubPullRequestSchema>> {
  const { owner, repo, ...options } = CreatePullRequestSchema.parse(params);

  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      body: options,
    }
  );

  return GitHubPullRequestSchema.parse(response);
}

export async function getPullRequest(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<z.infer<typeof GitHubPullRequestSchema>> {
  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`
  );
  return GitHubPullRequestSchema.parse(response);
}

export async function listPullRequests(
  owner: string,
  repo: string,
  options: Omit<z.infer<typeof ListPullRequestsSchema>, 'owner' | 'repo'>
): Promise<z.infer<typeof GitHubPullRequestSchema>[]> {
  const url = new URL(`https://api.github.com/repos/${owner}/${repo}/pulls`);
  
  if (options.state) url.searchParams.append('state', options.state);
  if (options.head) url.searchParams.append('head', options.head);
  if (options.base) url.searchParams.append('base', options.base);
  if (options.sort) url.searchParams.append('sort', options.sort);
  if (options.direction) url.searchParams.append('direction', options.direction);
  if (options.per_page) url.searchParams.append('per_page', options.per_page.toString());
  if (options.page) url.searchParams.append('page', options.page.toString());

  const response = await githubRequest(url.toString());
  return z.array(GitHubPullRequestSchema).parse(response);
}

export async function createPullRequestReview(
  owner: string,
  repo: string,
  pullNumber: number,
  options: Omit<z.infer<typeof CreatePullRequestReviewSchema>, 'owner' | 'repo' | 'pull_number'>
): Promise<z.infer<typeof PullRequestReviewSchema>> {
  // Transform comments to GitHub API format
  const transformedOptions = {
    ...options,
    comments: options.comments?.map((comment: {
      path: string;
      start_line: number;
      end_line?: number;
      start_side?: 'LEFT' | 'RIGHT';
      end_side?: 'LEFT' | 'RIGHT';
      body: string;
    }) => {
      const endLine = comment.end_line || comment.start_line;
      const startSide = comment.start_side || 'RIGHT';
      const endSide = comment.end_side || startSide;
      
      return {
        path: comment.path,
        line: comment.start_line,
        side: startSide.toLowerCase(),
        start_line: comment.start_line,
        start_side: startSide.toLowerCase(),
        line_end: endLine,
        side_end: endSide.toLowerCase(),
        body: comment.body
      };
    })
  };

  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`,
    {
      method: 'POST',
      body: transformedOptions,
    }
  );
  return PullRequestReviewSchema.parse(response);
}

export async function mergePullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  options: Omit<z.infer<typeof MergePullRequestSchema>, 'owner' | 'repo' | 'pull_number'>
): Promise<any> {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/merge`,
    {
      method: 'PUT',
      body: options,
    }
  );
}

export async function getPullRequestFiles(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<z.infer<typeof PullRequestFileSchema>[]> {
  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`
  );
  return z.array(PullRequestFileSchema).parse(response);
}

export async function updatePullRequestBranch(
  owner: string,
  repo: string,
  pullNumber: number,
  expectedHeadSha?: string
): Promise<void> {
  await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/update-branch`,
    {
      method: "PUT",
      body: expectedHeadSha ? { expected_head_sha: expectedHeadSha } : undefined,
    }
  );
}

export async function getPullRequestComments(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<z.infer<typeof PullRequestCommentSchema>[]> {
  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/comments`
  );
  return z.array(PullRequestCommentSchema).parse(response);
}

export async function getPullRequestReviews(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<z.infer<typeof PullRequestReviewSchema>[]> {
  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`
  );
  return z.array(PullRequestReviewSchema).parse(response);
}

export async function getPullRequestStatus(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<z.infer<typeof CombinedStatusSchema>> {
  // First get the PR to get the head SHA
  const pr = await getPullRequest(owner, repo, pullNumber);
  const sha = pr.head.sha;

  // Then get the combined status for that SHA
  const response = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/status`
  );
  return CombinedStatusSchema.parse(response);
}