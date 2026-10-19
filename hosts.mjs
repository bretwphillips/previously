// Where a ticket, merge request or branch lives on the repo's host. GitLab serves
// issues as work items (/-/issues/<n> is a 404 on newer GitLab); GitHub has
// issues, pull requests and trees at the top level. Told apart by the web address.
export const isGitHub = (web) => /^https?:\/\/(www\.)?github\.com\//.test(web ?? "");
export const issueUrl = (web, n) => (!web ? null : isGitHub(web) ? `${web}/issues/${n}` : `${web}/-/work_items/${n}`);
export const mrUrl = (web, n) => (!web ? null : isGitHub(web) ? `${web}/pull/${n}` : `${web}/-/merge_requests/${n}`);
export const branchUrl = (web, b) =>
  !web ? null : isGitHub(web) ? `${web}/tree/${encodeURIComponent(b)}` : `${web}/-/tree/${encodeURIComponent(b)}`;
