import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white/80 shadow-[0_24px_60px_rgba(17,17,17,0.06)] backdrop-blur md:flex-row">
        <section className="flex flex-1 flex-col justify-center bg-[#f5f5f5] p-8 sm:p-10 lg:p-12">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900">
            Smart Task Management
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl lg:text-[2.7rem]">
            Stay organized without the noise.
          </h1>
          <p className="max-w-xl text-base text-zinc-600">
            Bring priorities, deadlines, and daily work into one calm workspace
            that feels effortless to use.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-medium text-zinc-900">
            <li className="flex items-center gap-2">
              <span className="text-base">•</span>
              <span>Clear task tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">•</span>
              <span>Fast collaboration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">•</span>
              <span>Progress you can trust</span>
            </li>
          </ul>
        </section>

        <section className="flex flex-1 items-center p-6 sm:p-8 lg:p-10">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
