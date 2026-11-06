/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { updateBadgeLists } from "./modules/badges";

export const settings = definePluginSettings({
    showPrefix: {
        type: OptionType.BOOLEAN,
        description: "Whether to show the Mod Name as a prefix on the badge",
        default: true,
        onChange: updateBadgeLists
    },
    showCustom: {
        type: OptionType.BOOLEAN,
        displayName: "Show Custom Badges",
        description: "Whether you want to see custom badges or not",
        default: true,
        onChange: updateBadgeLists
    }
});
