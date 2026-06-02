export type HeroTalent = {
  id: string;
  title?: string;
  category?: string;
  description?: string;
  files?: string | string[];
  student?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
};

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export function getTalentFileUrl(filePath: string): string {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;

  const base = apiBase().replace(/\/$/, '');

  if (filePath.startsWith('/uploads/')) {
    return `${base}${filePath}`;
  }
  if (filePath.startsWith('uploads/')) {
    return `${base}/${filePath}`;
  }

  let cleanPath = filePath;
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
  if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.substring(8);
  if (cleanPath.startsWith('talents/')) cleanPath = cleanPath.substring(8);

  return `${base}/uploads/talents/${cleanPath}`;
}

/** Build ordered URL candidates for a file (handles varying API path shapes). */
export function getFileUrlCandidates(filePath: string): string[] {
  if (!filePath) return [];
  const candidates = new Set<string>();
  candidates.add(getTalentFileUrl(filePath));

  const base = apiBase().replace(/\/$/, '');
  if (!filePath.startsWith('http')) {
    const withSlash = filePath.startsWith('/') ? filePath : `/${filePath}`;
    candidates.add(`${base}${withSlash}`);
  }

  return [...candidates];
}

export function getTalentMediaFiles(talent: HeroTalent): string[] {
  if (!talent.files) return [];
  return Array.isArray(talent.files) ? talent.files : [talent.files];
}

export function getTalentPreviewUrls(talent: HeroTalent): string[] {
  const files = getTalentMediaFiles(talent);
  const urls: string[] = [];

  for (const file of files) {
    if (/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i.test(file)) {
      for (const url of getFileUrlCandidates(file)) {
        if (!urls.includes(url)) urls.push(url);
      }
    }
  }

  return urls;
}

export function getTalentPreviewUrl(talent: HeroTalent): string | null {
  const urls = getTalentPreviewUrls(talent);
  return urls[0] ?? null;
}

export function talentHasPreview(talent: HeroTalent): boolean {
  return getTalentMediaFiles(talent).some((file) =>
    /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i.test(file)
  );
}

export function getStudentName(talent: HeroTalent): string {
  const { firstName, lastName } = talent.student ?? {};
  return [firstName, lastName].filter(Boolean).join(' ') || 'Student';
}

export function getStudentInitials(talent: HeroTalent): string {
  const { firstName, lastName } = talent.student ?? {};
  return `${firstName?.[0] ?? 'V'}${lastName?.[0] ?? 'T'}`.toUpperCase();
}

export function sortTalentsForDisplay(talents: HeroTalent[]): HeroTalent[] {
  return [...talents].sort((a, b) => {
    const aScore = talentHasPreview(a) ? 1 : 0;
    const bScore = talentHasPreview(b) ? 1 : 0;
    return bScore - aScore;
  });
}
