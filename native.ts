/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { CspPolicies } from "@main/csp";

CspPolicies["api.domi-btnr.dev"] = [...(CspPolicies["api.domi-btnr.dev"] ?? []), "connect-src", "img-src"];
CspPolicies["gb.obamabot.me"] = [...(CspPolicies["gb.obamabot.me"] ?? []), "img-src"];
