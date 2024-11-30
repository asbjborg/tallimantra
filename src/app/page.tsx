import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-4">Tallimantra</h1>
        <p className="text-lg text-muted-foreground">Documentation and plugin management for Cursor</p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <a href="/docs" className="group rounded-lg border border-border px-5 py-4 transition-colors hover:border-foreground">
          <h2 className="mb-3 text-2xl font-semibold">
            Documentation{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-muted-foreground">Find in-depth information about Tallimantra features and API.</p>
        </a>

        <a href="/blog" className="group rounded-lg border border-border px-5 py-4 transition-colors hover:border-foreground">
          <h2 className="mb-3 text-2xl font-semibold">
            Blog{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-muted-foreground">Learn about our journey and latest developments.</p>
        </a>

        <a href="/plugins" className="group rounded-lg border border-border px-5 py-4 transition-colors hover:border-foreground">
          <h2 className="mb-3 text-2xl font-semibold">
            Plugins{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="text-muted-foreground">Discover and install plugins to enhance your experience.</p>
        </a>
      </div>
    </main>
  );
}
