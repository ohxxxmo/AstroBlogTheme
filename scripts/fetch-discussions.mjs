import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { graphql } from "@octokit/graphql";
import { loadEnv } from "vite";

const gql = String.raw;

function slugify(title) {
  return (
    title
      .toLowerCase()
      // .replace(/[^\w\s-]/g, "")
      .replace(/[^\u4e00-\u9fff\w\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .replace(/[-]+/g, "-")
      .trim()
  );
}

async function fetchDiscussions() {
  // Use GitHub API to fetch discussions
  // const { GITHUB_TOKEN } = loadEnv("production", process.cwd(), "");

  // 获取环境变量
  const env = await loadEnv("production", process.cwd(), "");
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;

  const graphqlAuth = graphql.defaults({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  // Retrieve pinned discussions ids
  const resPinned = await graphqlAuth(
    gql`
      query {
        repository(owner: "<owner>", name: "<repo>") {
          pinnedDiscussions(last: 100) {
            nodes {
              discussion {
                id
              }
            }
          }
        }
      }
    `
      .replace("<owner>", owner)
      .replace("<repo>", repo),
  );

  const pinnedDiscussionsIds = resPinned.repository.pinnedDiscussions.nodes.map(
    (node) => node.discussion.id,
  );

  // Retrieve all discussions (Drafts & Release categories)
  const res = await graphqlAuth(
    gql`
      query {
        search(
          query: "repo:<owner>/<repo> is:open category:Drafts category:Release"
          type: DISCUSSION
          last: 100
        ) {
          edges {
            node {
              ... on Discussion {
                id
                title
                body
                category {
                  slug
                }
                labels(last: 100) {
                  nodes {
                    name
                  }
                }
                createdAt
                url
              }
            }
          }
          discussionCount
        }
      }
    `
      .replace("<owner>", owner)
      .replace("<repo>", repo),
  );

  return res.search.edges
    .map((edge) => edge.node)
    .map((discussion) => ({
      ...discussion,
      category: discussion.category.slug,
      labels: discussion.labels.nodes.map((node) => node.name),
      isPinned: pinnedDiscussionsIds.includes(discussion.id),
    }));
}

fetchDiscussions().then((discussions) =>
  discussions.map((discussion, idx) => {
    // Extract frontmatter data from discussion Markdown
    const { content: body, data: frontmatter } = matter(discussion.body);

    // Construct post data object
    const post = {
      title: discussion.title,
      ...frontmatter,
      categories: `[${discussion.labels
        .filter((label) => !label.includes("@"))
        .map((label) => `"${label}"`)
        .join(", ")}]`,
      pubDate: discussion.createdAt,
      // updated_at: discussion.updatedAt,
      draft: discussion.category === "drafts",
      picked: discussion.isPinned,
      featured: discussion.labels.some((label) => label === "@featured"),
    };

    // Create a slug from the title of the post (this is still problematic, more on that later on)
    const slug = slugify(discussion.title);

    const filename = `${slug}.md`; // TODO: handle posts with the same title

    // Construct the post Markdown content
    const content = `---
${Object.keys(post)
  .map((key) => `${key}: ${post[key]}`)
  .join("\n")}
---
 
${body}
`.replace(/\r/g, "");

    // Save new formatted Markdown to a file under "src/content/blog"
    const dist = path.join(process.cwd(), "src/content/posts");

    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist);
    }

    fs.writeFile(`${dist}/${filename}`, content, (err) => {
      if (err) throw err;
      console.log(`Saved discussion ${idx + 1} to ${filename}`);
    });
  }),
);
