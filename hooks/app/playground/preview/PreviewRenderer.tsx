// ─────────────────────────────────────────────────────────────────────────────
// PreviewRenderer — RSC that compiles and renders a live MDX example.
// Uses the same shared plugin pipeline as @next/mdx and condition pages.
// ─────────────────────────────────────────────────────────────────────────────
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/components/mdx/MDXComponents";
import type { ComponentEntry } from "@/components/publish/registry";
import { remarkPlugins, rehypePlugins } from "@/lib/mdx-plugins";

interface PreviewRendererProps {
  entry: ComponentEntry;
}

export async function PreviewRenderer({ entry }: PreviewRendererProps) {
  // Prefer the directive example — that's the simplified authoring syntax
  const source = entry.directiveExample ?? entry.mdxExample;

  return (
    <>
      {/*
        Height reporter: posts scrollHeight to parent window so the iframe
        in ComponentCard resizes to fit content without scrollbars.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
            function report(){
              var h=document.body.scrollHeight;
              window.parent.postMessage({type:'preview-height',height:h},'*');
            }
            if(document.readyState==='complete'){report();}
            else{window.addEventListener('load',report);}
            setTimeout(report,300);
            setTimeout(report,800);
          })();`,
        }}
      />
      <div className="preview-root">
        <MDXRemote
          source={source}
          components={getMDXComponents({})}
          options={{
            mdxOptions: {
              remarkPlugins: [...remarkPlugins],
              rehypePlugins: [...rehypePlugins],
            },
          }}
        />
      </div>
    </>
  );
}
