<template>
  <main class="min-h-screen bg-slate-950 text-white">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
      <RouterLink to="/" class="text-xl font-bold">QR Profile</RouterLink>
      <div class="flex gap-3">
        <RouterLink class="rounded-md px-4 py-2 text-sm font-semibold hover:bg-white/10" to="/login">Login</RouterLink>
        <RouterLink class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950" to="/register">Start free</RouterLink>
      </div>
    </nav>
    <section class="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
      <div>
        <p class="font-semibold text-emerald-300">Universal QR digital profile</p>
        <h1 class="mt-4 text-5xl font-bold leading-tight">One QR code for every link your business needs.</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Create a polished mobile profile for WhatsApp, Instagram, Maps, reviews, menus, catalogues,
          bookings, payments, and any custom URL. Keep the printed QR stable while links change anytime.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink class="rounded-md bg-emerald-500 px-5 py-3 font-semibold text-slate-950" to="/register">Create your page</RouterLink>
          <RouterLink class="rounded-md border border-white/20 px-5 py-3 font-semibold" to="/p/techzone">View demo profile</RouterLink>
        </div>
      </div>
      <div class="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl">
        <div class="rounded-[1.4rem] bg-white p-5 text-slate-950">
          <div class="h-28 rounded-xl bg-gradient-to-br from-emerald-400 to-slate-950"></div>
          <div class="-mt-10 ml-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-slate-950 text-2xl font-bold text-white">Q</div>
          <h2 class="mt-4 text-2xl font-bold">TechZone</h2>
          <p class="mt-2 text-sm text-slate-500">Repairs, accessories, phones, and quick support.</p>
          <div class="mt-5 space-y-3">
            <div class="rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white">WhatsApp</div>
            <div class="rounded-lg border border-slate-200 px-4 py-3 font-semibold">Instagram</div>
            <div class="rounded-lg border border-slate-200 px-4 py-3 font-semibold">Google Maps</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
