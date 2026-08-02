export const FEATURE_KINDS = ['INFO', 'TIME', 'QUANTITY'];
const SLUG_RE = /^[a-z0-9-]+$/;

export interface FeaturePayload {
  id?: string;
  kind?: string;
  nameAr?: string;
  nameEn?: string;
  descAr?: string | null;
  descEn?: string | null;
  category?: string | null;
  unitPrice?: number | null;
  purchasable?: boolean;
  sortOrder?: number;
  active?: boolean;
}

export function validateFeaturePayload(body: FeaturePayload, partial: boolean): string | null {
  if (!partial) {
    if (!body.id || !SLUG_RE.test(body.id)) return 'Invalid id (lowercase letters, digits, dashes)';
    if (!body.kind || !FEATURE_KINDS.includes(body.kind)) return 'Invalid kind';
    if (!body.nameAr?.trim() || !body.nameEn?.trim()) return 'Both Arabic and English names are required';
  } else {
    if (body.id !== undefined) return 'id cannot be changed';
    if (body.kind !== undefined && !FEATURE_KINDS.includes(body.kind)) return 'Invalid kind';
    if (body.nameAr !== undefined && !body.nameAr?.trim()) return 'Arabic name cannot be empty';
    if (body.nameEn !== undefined && !body.nameEn?.trim()) return 'English name cannot be empty';
  }
  if (body.kind === 'TIME' && !body.category) return 'TIME features require a category (meeting or theater)';
  if (body.category && !['meeting', 'theater'].includes(body.category)) return 'Invalid category';
  if (body.purchasable && !(typeof body.unitPrice === 'number' && body.unitPrice > 0)) {
    return 'Purchasable features require a unit price greater than 0';
  }
  if (body.unitPrice !== undefined && body.unitPrice !== null && (typeof body.unitPrice !== 'number' || body.unitPrice < 0)) {
    return 'Invalid unit price';
  }
  return null;
}
