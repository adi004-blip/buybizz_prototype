"use client";

import { Suspense } from "react";
import DownloadsPageContent from "./downloads-content";

export default function DownloadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING...</p>
        </div>
      </div>
    }>
      <DownloadsPageContent />
    </Suspense>
  );
}
