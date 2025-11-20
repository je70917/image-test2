import { useMemo, useState } from "react";
import "./App.css";
import catalog from "../images/catalog.json";

function App() {
  const [colorFilter, setColorFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const items = useMemo(() => {
    // Map catalog entries to include a resolved image URL and alt text
    return catalog.map((item) => {
      const file = item.title;
      const src = new URL(`../images/${file}`, import.meta.url).href;
      const alt = `${file} - Color: ${item.color}, Size: ${item.size}`;
      return { ...item, src, alt };
    });
  }, []);

  const colors = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.color))).sort();
  }, [items]);

  const sizes = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.size))).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const okColor = colorFilter ? i.color === colorFilter : true;
      const okSize = sizeFilter ? i.size === sizeFilter : true;
      const okSearch = searchQuery
        ? i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.size.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return okColor && okSize && okSearch;
    });
  }, [items, colorFilter, sizeFilter, searchQuery]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-dark-text m-0">
          Image Gallery
        </h1>
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            className="bg-dark-panel border border-dark-border rounded-lg px-3 py-2 text-dark-text text-sm outline-none min-w-[200px] placeholder:text-dark-muted focus:border-dark-text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-3 items-center">
            <label className="flex gap-1.5 items-center bg-dark-panel border border-dark-border px-2.5 py-1.5 rounded-lg">
              <span className="text-dark-muted text-xs">Color</span>
              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                className="bg-transparent border-none text-dark-text text-sm outline-none"
              >
                <option value="">All</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex gap-1.5 items-center bg-dark-panel border border-dark-border px-2.5 py-1.5 rounded-lg">
              <span className="text-dark-muted text-xs">Size</span>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-transparent border-none text-dark-text text-sm outline-none"
              >
                <option value="">All</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            {(colorFilter || sizeFilter || searchQuery) && (
              <button
                className="bg-transparent border border-dark-border text-dark-text px-2.5 py-2 rounded-lg cursor-pointer hover:bg-dark-panel hover:border-dark-text transition-colors"
                onClick={() => {
                  setColorFilter("");
                  setSizeFilter("");
                  setSearchQuery("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((img) => (
            <figure
              key={img.title}
              className="bg-dark-panel border border-dark-border rounded-[10px] overflow-hidden flex flex-col"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-[180px] object-cover block"
              />
              <figcaption className="p-3 flex flex-col gap-1.5">
                <div className="font-semibold text-sm text-dark-text">
                  {img.title}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-dark-muted bg-white/[0.04] border border-dark-border px-2 py-0.5 rounded-full">
                    Color: {img.color}
                  </span>
                  <span className="text-xs text-dark-muted bg-white/[0.04] border border-dark-border px-2 py-0.5 rounded-full">
                    Size: {img.size}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-4 text-dark-muted text-center">
            No images match the current filters.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
