'use client';

import { QRCodeSVG } from 'qrcode.react';
import type { AttendanceRecordStatus } from '@/types';

export interface QrMemberCardProps {
  qrValue: string;
  studentName: string;
  studentSubtitle: string;
  status: AttendanceRecordStatus;
  printMode: boolean;
}

function statusLabel(status: AttendanceRecordStatus): string {
  if (status === 'PRESENT') return 'Present';
  if (status === 'EXCUSED') return 'Excused';
  return 'Missing';
}

function statusBadgeClasses(status: AttendanceRecordStatus): string {
  if (status === 'PRESENT') return 'bg-green-100 text-green-800';
  if (status === 'EXCUSED') return 'bg-accent/10 text-accent';
  return 'bg-bg-beige-light text-text-secondary';
}

export function QrMemberCard({ qrValue, studentName, studentSubtitle, status, printMode }: QrMemberCardProps) {
  const qrSize = printMode ? 180 : 110;
  const hasQrValue = Boolean(qrValue && qrValue.trim());

  return (
    <div className="border border-border/30 bg-card rounded-lg overflow-hidden">
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-medium text-text-primary truncate">{studentName}</div>
            <div className="text-xs text-text-secondary truncate">{studentSubtitle}</div>
          </div>
          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${statusBadgeClasses(status)}`}>
            {statusLabel(status)}
          </span>
        </div>

        <div className="flex items-center justify-center">
          {hasQrValue ? (
            <QRCodeSVG value={qrValue} size={qrSize} level="M" includeMargin />
          ) : (
            <div className="w-[110px] h-[110px] rounded-md border border-border/30 bg-bg-beige-light flex items-center justify-center">
              <div className="text-[10px] text-text-secondary text-center px-2">{'QR missing'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

