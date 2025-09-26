"use client";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const creatorHighlights = [
  {
    icon: "heroicons:users",
    label: "Global Creator Network",
    description: "Co-create with spatial storytellers across 60+ countries in real time.",
  },
  {
    icon: "heroicons:camera",
    label: "Professional Capture Stack",
    description: "Ship immersive 3D stories with the Galois rig and panoramic toolkit.",
  },
  {
    icon: "heroicons:currency-dollar",
    label: "Diverse Revenue Streams",
    description: "Unlock brand collaborations, tailored projects, and distribution royalties.",
  },
];

const contactHighlights = [
  {
    icon: "heroicons:rocket-launch",
    label: "Strategic Project Scoping",
    description: "Realsee partners capture requirements and align budgets before introductions.",
  },
  {
    icon: "heroicons:shield-check",
    label: "Verified Professional Network",
    description: "Only certified creators receive the brief to ensure quality and reliability.",
  },
  {
    icon: "heroicons:chat-bubble-left-right",
    label: "Hands-on Support",
    description: "Our collaboration team coordinates timelines, assets, and delivery milestones.",
  },
];

type JoinCTAVariant = "creator" | "contact";

interface JoinCTAProps {
  variant?: JoinCTAVariant;
  professionalName?: string;
}

export function JoinCTA({ variant = "creator", professionalName }: JoinCTAProps) {
  const isContact = variant === "contact";
  const heading = isContact
    ? professionalName
      ? `Collaborate with ${professionalName}`
      : "Connect with Realsee Creators"
    : "Become a Realsee Certified Creator";
  const description = isContact
    ? "Submit a collaboration brief and our Realsee team will introduce you to the best-fit certified creators, manage project onboarding, and ensure delivery quality end to end."
    : "Connect with premium projects and forward-thinking brands while your spatial work gains visibility, revenue, and technical support. We provide the end-to-end toolchain, creator training, and business matchmaking to help you scale faster.";
  const highlights = isContact ? contactHighlights : creatorHighlights;
  const ctaLabel = isContact ? "Contact via Realsee" : "Join the Creator Center";
  const badgeLabel = isContact ? "Project Collaboration" : "Realsee Creator Program";
  // 加入计划
  const baseHref = "https://home.realsee.ai/en/contact-us-join-realsee-creators-center";
  // 联系合作
  const contactHref = "https://forms.gle/8GpHCx34QM1FwkHu5";
  return (
    <section className="join-community-section relative overflow-hidden bg-gradient-to-b from-cyber-gray-900 via-cyber-gray-900/95 to-cyber-gray-800 py-24">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg/creator-hero.jpeg"
          alt=""
          fill
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%230a0f1a'/%3E%3C/svg%3E"
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-gray-900/80 via-cyber-gray-900/90 to-cyber-gray-900" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-5">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyber-brand-500/25 blur-3xl" />
        <div className="absolute left-[12%] top-32 h-72 w-72 rounded-full bg-cyber-neon-cyan/15 blur-[120px]" />
        <div className="absolute right-[10%] top-48 h-80 w-80 rounded-full bg-cyber-brand-500/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-cyber-gray-700 bg-cyber-gray-800/90 p-10 text-center shadow-none backdrop-blur-xl md:p-16">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyber-brand-400/50 bg-gradient-to-r from-cyber-brand-500/25 via-cyber-neon-cyan/20 to-cyber-neon-magenta/25 px-6 py-2 text-sm font-semibold text-cyber-neon-cyan shadow-cyber-brand-500/40 backdrop-blur-md transition-shadow duration-300 hover:shadow-cyber-brand-500/60">
            <Icon icon="heroicons:sparkles" width={16} className="text-cyber-neon-cyan" />
            <span>{badgeLabel}</span>
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-cyber-gray-100 md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-cyber-gray-300 md:text-lg">
            {description}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="cyber-card flex h-full flex-col items-center border-cyber-gray-600/70 bg-cyber-gray-800/80 p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:border-cyber-brand-400 hover:bg-cyber-gray-800/90"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-cyber-brand-500/15 p-3 text-cyber-neon-cyan">
                  <Icon icon={item.icon} width={20} />
                </div>
                <h3 className="text-lg font-semibold text-cyber-gray-100">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cyber-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href={isContact ? contactHref : baseHref}
              className="cyber-btn-primary cyber-focus cyber-gentle-pulse inline-flex items-center gap-3 rounded-full px-12 py-4 text-lg font-semibold text-white shadow-cyber-brand-500/40 transition-transform duration-300 hover:scale-[1.05] hover:shadow-cyber-brand-500/50 active:scale-95"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="heroicons:rocket-launch" width={20} />
              <span>{ctaLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
