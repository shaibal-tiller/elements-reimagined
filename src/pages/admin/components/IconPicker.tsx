import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { iconRegistry, getIcon } from "../../../lib/iconRegistry";

const allIconNames = Object.keys(iconRegistry);

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
  compact?: boolean;
}

const ICONS_PER_PAGE = 200;

export default function IconPicker({ value, onChange, compact }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ICONS_PER_PAGE);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search) return allIconNames;
    const q = search.toLowerCase();
    return allIconNames.filter((n) => n.toLowerCase().includes(q));
  }, [search]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(ICONS_PER_PAGE);
  }, [search]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
      setVisibleCount(ICONS_PER_PAGE);
    }
  }, [open]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setVisibleCount((c) => Math.min(c + ICONS_PER_PAGE, filtered.length));
    }
  }, [filtered.length]);

  const SelectedIcon = getIcon(value);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white hover:border-slate-500 transition-colors ${
          compact ? "px-2 py-1.5 text-xs w-28" : "px-3 py-2.5 w-full"
        }`}
      >
        <SelectedIcon className={compact ? "w-3.5 h-3.5 text-slate-300 shrink-0" : "w-4 h-4 text-slate-300 shrink-0"} />
        <span className="truncate flex-1 text-left text-sm">{value || "Select icon"}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-1 w-80 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-8 pr-8 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 px-1">
              {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Icon grid */}
          <div
            ref={gridRef}
            onScroll={handleScroll}
            className="grid grid-cols-8 gap-0.5 p-2 max-h-64 overflow-y-auto"
          >
            {visible.map((name) => {
              const Icon = iconRegistry[name];
              const isSelected = name === value;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${
                    isSelected
                      ? "bg-indigo-500/30 ring-1 ring-indigo-400 text-indigo-300"
                      : "hover:bg-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-8 text-center text-sm text-slate-500 py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Multi-select variant for marquee icons ── */

interface MultiIconPickerProps {
  value: string[];
  onChange: (names: string[]) => void;
}

export function MultiIconPicker({ value, onChange }: MultiIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ICONS_PER_PAGE);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search) return allIconNames;
    const q = search.toLowerCase();
    return allIconNames.filter((n) => n.toLowerCase().includes(q));
  }, [search]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  useEffect(() => {
    setVisibleCount(ICONS_PER_PAGE);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
      setVisibleCount(ICONS_PER_PAGE);
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setVisibleCount((c) => Math.min(c + ICONS_PER_PAGE, filtered.length));
    }
  }, [filtered.length]);

  const toggleIcon = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((n) => n !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const removeIcon = (name: string) => {
    onChange(value.filter((n) => n !== name));
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Selected icons as pills */}
      <div className="min-h-[42px] flex flex-wrap gap-1.5 p-2 bg-slate-700/50 border border-slate-600 rounded-lg">
        {value.map((name) => {
          const Icon = getIcon(name);
          return (
            <span
              key={name}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-600/60 rounded-md text-xs text-slate-200"
            >
              <Icon className="w-3 h-3" />
              {name}
              <button
                type="button"
                onClick={() => removeIcon(name)}
                className="ml-0.5 text-slate-400 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          + Add icon
        </button>
      </div>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-1 w-80 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-8 pr-8 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 px-1">
              {filtered.length} icon{filtered.length !== 1 ? "s" : ""} &middot; {value.length} selected
            </p>
          </div>

          <div
            ref={gridRef}
            onScroll={handleScroll}
            className="grid grid-cols-8 gap-0.5 p-2 max-h-64 overflow-y-auto"
          >
            {visible.map((name) => {
              const Icon = iconRegistry[name];
              const isSelected = value.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => toggleIcon(name)}
                  className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${
                    isSelected
                      ? "bg-indigo-500/30 ring-1 ring-indigo-400 text-indigo-300"
                      : "hover:bg-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-8 text-center text-sm text-slate-500 py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
