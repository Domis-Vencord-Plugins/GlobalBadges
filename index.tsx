/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addProfileBadge, BadgePosition, ProfileBadge, removeProfileBadge } from "@api/Badges";
import definePlugin from "@utils/types";

import { getGlobalBadges, useBadgeUpdates } from "./modules/badges";
import { settings } from "./settings";

const Badge: ProfileBadge = {
    id: "global_badges",
    position: BadgePosition.START,
    getBadges: ({ userId }) => {
        const { showPrefix, showCustom } = settings.store;

        return getGlobalBadges(userId)
            .filter(badge => showCustom || !badge.custom)
            .map(badge => {
                const name = !badge.custom && showPrefix ? `${badge.mod} ${badge.name}` : badge.name;
                return {
                    id: `global_badges_${badge.mod}_${badge.name}`,
                    description: name,
                    iconSrc: badge.image,
                    infoLabel: badge.mod,
                    props: badge.mod === "Replugged" ? { style: { transform: "scale(0.9)" } } : undefined
                };
            });
    }
};

export default definePlugin({
    name: "GlobalBadges",
    description: "Adds global badges from other client mods",
    authors: [{ name: "domi.btnr", id: 354191516979429376n }],
    settings,
    patches: [
        {
            find: "?.getBadges()??[]",
            replacement: {
                match: /(?=if\(null==(\i)\)return\[\];let \i=\1\?\.getBadges\(\))/,
                replace: "$self.useBadgeUpdates();"
            }
        }
    ],

    useBadgeUpdates,

    start: () => addProfileBadge(Badge),
    stop: () => removeProfileBadge(Badge)
});
