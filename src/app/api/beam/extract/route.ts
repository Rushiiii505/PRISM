import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input URL or text is required." },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();

    // Check if input is a GitHub PR URL
    const githubPrRegex = /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/i;
    const match = trimmedInput.match(githubPrRegex);

    if (match) {
      const [, owner, repo, pullNumber] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;

      // Fetch PR Metadata from GitHub REST API
      const prRes = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Prism-Dev-Engine",
        },
      });

      if (!prRes.ok) {
        throw new Error(`Failed to fetch PR from GitHub API (${prRes.status} ${prRes.statusText})`);
      }

      const prData = await prRes.json();

      // Fetch Diff content
      const diffRes = await fetch(`${apiUrl}.diff`, {
        headers: {
          Accept: "application/vnd.github.v3.diff",
          "User-Agent": "Prism-Dev-Engine",
        },
      });

      const diffText = diffRes.ok ? await diffRes.text() : "Diff unavailable";

      return NextResponse.json({
        success: true,
        sourceType: "github_pr",
        title: prData.title || `PR #${pullNumber} in ${owner}/${repo}`,
        description: prData.body || "No description provided in PR.",
        repoName: `${owner}/${repo}`,
        author: prData.user?.login || "Contributor",
        prNumber: parseInt(pullNumber, 10),
        diff: diffText.slice(0, 8000), // Limit length for LLM ingestion context
        htmlUrl: prData.html_url,
      });
    }

    // Fallback: Handle raw text or Jira summary
    return NextResponse.json({
      success: true,
      sourceType: "text",
      title: trimmedInput.slice(0, 80).split("\n")[0] || "Custom Dev Update",
      description: trimmedInput,
      repoName: "custom-repo",
      author: "Engineering Team",
      diff: "Manual update provided by user.",
    });
  } catch (error: any) {
    console.error("Error in /api/beam/extract:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract PR details." },
      { status: 500 }
    );
  }
}
