/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";
import { useForceUpdater } from "@utils/react";
import { useEffect } from "@webpack/common";

import { ApiBadge, ApiResponse, Badge } from "../types";

const API_URL = "https://api.domi-btnr.dev/clientmodbadges";
const EXPIRES = 1000 * 60 * 15;
const RETRY_AFTER = 1000 * 60;

const FULL_NAMES: Record<string, string> = { hunter: "Bug Hunter", early: "Early User" };

const logger = new Logger("GlobalBadges");
const cache = new Map<string, { badges: Badge[]; expires: number; }>();
const pending = new Set<string>();
const listeners = new Set<() => void>();

export const updateBadgeLists = () => listeners.forEach(listener => listener());

export function useBadgeUpdates() {
    const forceUpdate = useForceUpdater();
    useEffect(() => {
        listeners.add(forceUpdate);
        return () => void listeners.delete(forceUpdate);
    }, []);
}

function parseBadge(mod: string, badge: ApiBadge): Badge {
    if (typeof badge !== "string") return { mod, name: badge.name, image: badge.badge, custom: true };

    const name = badge.replace(mod, "").trim();
    return {
        mod,
        name: FULL_NAMES[name] ?? name.charAt(0).toUpperCase() + name.slice(1),
        image: `${API_URL}/badges/${mod}/${name.split(" ")[0]}`,
        custom: false
    };
}

function canLoadImage(src: string) {
    return new Promise<boolean>(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

async function requestBadges(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const body: ApiResponse = await res.json();
    const badges = Object.entries(body)
        .filter(([mod]) => mod.toLowerCase() !== "vencord")
        .flatMap(([mod, badges]) => badges.map(badge => parseBadge(mod, badge)));

    const loadable = await Promise.all(badges.map(badge => canLoadImage(badge.image)));
    return badges.filter((_, i) => loadable[i]);
}

async function loadBadges(userId: string) {
    pending.add(userId);
    try {
        cache.set(userId, { badges: await requestBadges(userId), expires: Date.now() + EXPIRES });
        updateBadgeLists();
    } catch (err) {
        logger.error(`Failed to fetch the badges of ${userId}`, err);
        cache.set(userId, { badges: cache.get(userId)?.badges ?? [], expires: Date.now() + RETRY_AFTER });
    } finally {
        pending.delete(userId);
    }
}

export function getGlobalBadges(userId: string) {
    const cached = cache.get(userId);
    if ((!cached || cached.expires < Date.now()) && !pending.has(userId)) loadBadges(userId);
    return cached?.badges ?? [];
}
