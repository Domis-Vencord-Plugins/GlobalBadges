/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type ApiBadge = string | { name: string; badge: string; };

export type ApiResponse = Record<string, ApiBadge[]>;

export interface Badge {
    mod: string;
    name: string;
    image: string;
    custom: boolean;
}
