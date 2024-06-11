const { request } = require('@octokit/request');

const octokit = request.defaults({
  baseUrl: 'https://api.github.com',
  headers: {
    authorization: `token ENV_GITHUB_TOKEN`
  }
});

async function run() {
  const owner = 'tteki1';
  const repo = 'demo1';
  const branch = 'main';

  try {
    await octokit.repos.updateBranchProtection({
      owner,
      repo,
      branch,
      required_status_checks: {
        strict: true,
        contexts: ['ci-build', 'ci-test']
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismissal_restrictions: {},
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 2
      },
      restrictions: null // Or specify who can push to the branch
    });

    console.log(`Branch protection rules applied to ${branch} in ${owner}/${repo}`);
  } catch (error) {
    console.error(`Failed to apply branch protection rules: ${error.message}`);
  }
}

run();
