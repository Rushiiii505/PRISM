import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GeneratedPosts } from "./store";

export async function downloadHypeKitZip(title: string, content: GeneratedPosts) {
  const zip = new JSZip();

  // Create folders
  const postsFolder = zip.folder("posts");
  const slidesFolder = zip.folder("slides");
  const communityFolder = zip.folder("community");

  // Add Social Posts
  if (postsFolder) {
    postsFolder.file("x_thread.txt", content.xThread.join("\n\n---\n\n"));
    postsFolder.file("linkedin_post.txt", content.linkedIn);
    postsFolder.file("discord_announcement.md", content.discord);
  }

  // Add 5-Slide Visual Carousel Assets & Metadata
  if (slidesFolder) {
    content.carouselSlides.forEach((slide, idx) => {
      const slideContent = `SLIDE ${idx + 1}: ${slide.title}\nTAG: ${slide.tag}\nSUBTITLE: ${slide.subtitle}\n\nBULLET POINTS:\n${slide.bulletPoints?.map((b) => `- ${b}`).join("\n") || ""}\n\nCODE SNIPPET:\n${slide.codeSnippet || "N/A"}`;
      slidesFolder.file(`slide_${idx + 1}_${slide.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.txt`, slideContent);
    });

    // Also include a master slides JSON for design tools
    slidesFolder.file("slides_metadata.json", JSON.stringify(content.carouselSlides, null, 2));
  }

  // Add Community Hype Kit Readme & Instructions
  if (communityFolder) {
    communityFolder.file("hype_kit_instructions.md", content.hypeKitReadme);
  }

  // Root README
  zip.file("README.md", `# Prism Automated Community Hype Kit\n\nRelease: ${title}\nGenerated on: ${new Date().toLocaleDateString()}\n\nThank you for using Prism! Launch these updates across Twitter/X, LinkedIn, Discord, and Instagram.`);

  // Generate ZIP blob and trigger browser download
  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 30);
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `prism_hype_kit_${cleanTitle || "release"}.zip`);
}
