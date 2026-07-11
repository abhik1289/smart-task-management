"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "../api/user";
import { fetchUserProfile } from "../api/user";

const profileQueryKey = ["user", "profile"];

export default function ProfilePage() {
  const queryResult = useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });

  const profile = queryResult.data as UserProfile | undefined;
  const { isLoading, isError } = queryResult;

  const displayEmail = useMemo(() => profile?.email ?? "", [profile]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-zinc-200 bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-red-200 bg-red-50 p-10 shadow-[0_30px_80px_rgba(220,38,38,0.08)]">
          <p className="text-lg font-semibold text-red-800">
            Unable to load your profile.
          </p>
          <p className="mt-3 text-sm text-red-700">
            Please sign in again or check your network connection.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-4xl font-semibold text-white">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Personal profile
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                  {profile.name}
                </h1>
                <p className="mt-2 text-sm text-slate-600">{profile.role}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-zinc-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Email
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {displayEmail}
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Provider
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {profile.provider}
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Status
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {profile.emailVerified ? "Verified" : "Awaiting confirmation"}
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Member since
                </p>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-300">
                Activity
              </p>
              <p className="mt-3 text-base leading-7 text-slate-100">
                This card displays your profile details in one clean view. There
                is no edit form here, only your current account information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
