export type FeatureKind = 'INFO' | 'TIME' | 'QUANTITY';
export type EntitlementSource = 'BOOKING' | 'PURCHASE' | 'ADMIN';
export type PurchaseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LedgerAction = 'GRANT' | 'CLAIM' | 'AUTO_APPLY' | 'REFUND' | 'REVOKE' | 'ADJUST';

export interface CatalogFeature {
  id: string;
  kind: FeatureKind;
  name: { ar: string; en: string };
  desc?: { ar: string | null; en: string | null };
  category: string | null;
  unitPrice: number | null;
  purchasable: boolean;
  sortOrder: number;
  active: boolean;
}

export interface SpaceEntitlementFeature {
  featureId: string;
  kind: FeatureKind;
  category: string | null;
  amount: number | null;
  name: { ar: string; en: string };
}

export interface EntitlementDto {
  id: string;
  featureId: string | null;
  name: { ar: string; en: string };
  kind: FeatureKind;
  category: string | null;
  totalAmount: number;
  usedAmount: number;
  available: number;
  source: EntitlementSource;
  bookingId: string | null;
  revoked: boolean;
  createdAt: string;
}

export interface LedgerEntryDto {
  id: string;
  entitlementId: string;
  action: LedgerAction;
  amount: number;
  note: string | null;
  bookingId: string | null;
  actorRole: 'USER' | 'ADMIN' | null;
  createdAt: string;
}

export interface PurchaseRequestDto {
  id: string;
  featureId: string;
  name: { ar: string; en: string };
  kind: FeatureKind;
  amount: number;
  unitPrice: number;
  total: number;
  status: PurchaseStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export function composeFeatureLabel(name: string, amount: number | null | undefined): string {
  return amount ? `${amount} ${name}` : name;
}
