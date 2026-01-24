'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddRecordForm } from '@/components/dashboard/add-record-form';

export default function AddRecordPage() {
  const router = useRouter();

  function handleCancel() {
    router.back();
  }

  function handleSuccess() {
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-bg-beige flex flex-col relative">
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 flex-1">
        <AddRecordForm onCancel={handleCancel} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
