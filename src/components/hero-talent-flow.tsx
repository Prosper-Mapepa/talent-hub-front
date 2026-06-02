"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Sparkles } from "lucide-react";
import apiClient from "@/lib/apiClient";
import {
  getStudentInitials,
  getStudentName,
  getTalentPreviewUrls,
  sortTalentsForDisplay,
  type HeroTalent,
} from "@/lib/talentMedia";

function TalentCardMedia({ talent }: { talent: HeroTalent }) {
  const urls = useMemo(() => getTalentPreviewUrls(talent), [talent]);
  const [urlIndex, setUrlIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const currentUrl = urls[urlIndex];

  if (!currentUrl || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[color:var(--vt-mint-50)] to-[color:var(--vt-teal-600)]/20">
        <span className="text-lg font-bold text-[color:var(--vt-teal-700)]">
          {getStudentInitials(talent)}
        </span>
      </div>
    );
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(currentUrl);

  if (isVideo) {
    return (
      <video
        src={currentUrl}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop
        autoPlay
        onError={() => {
          if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
          else setFailed(true);
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentUrl}
      alt={talent.title || "Student talent"}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => {
        if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
        else setFailed(true);
      }}
    />
  );
}

function TalentFlowCard({ talent }: { talent: HeroTalent }) {
  const href = talent.student?.id
    ? `/students/${talent.student.id}`
    : "/services";

  return (
    <Link href={href} className="group block w-full">
      <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="relative aspect-[5/4] overflow-hidden bg-[color:var(--vt-mint-50)]">
          <TalentCardMedia talent={talent} />
          {talent.category ? (
            <span className="absolute right-1 top-1 max-w-[calc(100%-0.5rem)] truncate rounded bg-[color:var(--vt-teal-950)]/85 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white">
              {talent.category}
            </span>
          ) : null}
        </div>
        <div className="px-2 py-1.5">
          <h3 className="truncate text-xs font-semibold text-[color:var(--vt-teal-950)]">
            {talent.title || "Talent"}
          </h3>
          <p className="truncate text-[10px] text-slate-500">{getStudentName(talent)}</p>
        </div>
      </article>
    </Link>
  );
}

function FlowColumn({
  talents,
  reverse,
  durationSec,
}: {
  talents: HeroTalent[];
  reverse?: boolean;
  durationSec: number;
}) {
  const loop = useMemo(() => [...talents, ...talents], [talents]);

  if (loop.length === 0) return null;

  return (
    <div className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden">
      <div
        className={`vt-talent-flow-track flex w-full flex-col gap-2 ${reverse ? "vt-talent-flow-track--reverse" : ""}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {loop.map((talent, index) => (
          <TalentFlowCard key={`${talent.id}-${index}`} talent={talent} />
        ))}
      </div>
    </div>
  );
}

function SkeletonColumn() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="aspect-[5/4] w-full animate-pulse rounded-xl bg-white/10"
        />
      ))}
    </div>
  );
}

function splitIntoColumns(items: HeroTalent[], count: number): HeroTalent[][] {
  if (items.length === 0) return [];
  const columns: HeroTalent[][] = Array.from({ length: count }, () => []);
  items.forEach((item, index) => {
    columns[index % count].push(item);
  });
  return columns.filter((col) => col.length > 0);
}

export function HeroTalentFlow() {
  const [talents, setTalents] = useState<HeroTalent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get("/students/talents/all")
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.data ?? res.data ?? [];
        const list = Array.isArray(raw) ? raw : [];

        const seen = new Set<string>();
        const unique = list.filter((t: HeroTalent) => {
          if (!t?.id || seen.has(t.id)) return false;
          seen.add(t.id);
          return true;
        });

        setTalents(sortTalentsForDisplay(unique).slice(0, 24));
      })
      .catch(() => {
        if (!cancelled) setTalents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo(
    () => splitIntoColumns(talents, talents.length >= 6 ? 3 : 2),
    [talents]
  );

  const hasTalents = columns.length > 0;
  const columnDurations = [38, 44, 40];

  return (
    <div className="relative flex h-full min-h-[32rem] w-full max-w-xl lg:max-w-none">
      <div className="vt-talent-flow-panel relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-xl ring-1 ring-white/10 backdrop-blur-md">
        <div className="relative z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-2.5 py-2 sm:px-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[color:var(--vt-teal-600)]" />
            <span className="text-xs font-semibold text-white sm:text-[13px]">
              Live feed
            </span>
            <span className="hidden text-[10px] text-white/45 sm:inline">· verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wide text-white/45">
              Top talent
            </span>
            <Award className="h-3.5 w-3.5 shrink-0 text-[color:var(--vt-purple-600)]" />
          </div>
        </div>

        <div className="vt-talent-flow-viewport relative min-h-0 flex-1 overflow-hidden">
          <div className="absolute inset-0 grid auto-cols-fr grid-flow-col gap-1.5 px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5">
            {loading ? (
              <>
                <SkeletonColumn />
                <SkeletonColumn />
                <SkeletonColumn />
              </>
            ) : hasTalents ? (
              columns.map((col, i) => (
                <FlowColumn
                  key={i}
                  talents={col}
                  reverse={i % 2 === 1}
                  durationSec={columnDurations[i] ?? 42}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
                <Sparkles className="h-7 w-7 text-[color:var(--vt-teal-600)]" />
                <p className="text-sm font-semibold text-white">Showcase your talent</p>
                <p className="max-w-xs text-xs text-white/60">
                  Be among the first students featured on VeriTalent.
                </p>
                <Link
                  href="/register"
                  className="mt-1 rounded-full bg-[color:var(--vt-teal-600)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[color:var(--vt-teal-600)]/90"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {!loading && hasTalents ? (
          <div className="relative z-20 shrink-0 border-t border-white/10 px-2.5 py-1.5 text-center sm:px-3">
            <p className="text-[11px] text-white/55">
              <span className="font-bold text-[color:var(--vt-gold-400)]">
                {talents.length}
              </span>{" "}
              talents · updates live
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
