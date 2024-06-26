const { Octokit } = require("@octokit/core");
const fetch = require("node-fetch");

const token = process.env.GITHUB_TOKEN;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

const octokit = new Octokit({
  auth: token,
  request: {
    fetch: fetch
  }
});

async function applyBranchProtection() {
  try {
    const branchProtectionSettings = {
      owner,
      repo,
      branch: "main",
      required_status_checks: {
        strict: true,
        contexts: ["continuous-integration"]
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismissal_restrictions: {},
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 2
      },
      restrictions: null
    };

    await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', branchProtectionSettings);

    console.log("Branch protection rules applied successfully");
  } catch (error) {
    console.error("Failed to apply branch protection rules", error);
  }
}

applyBranchProtection();
