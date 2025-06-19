import { CspPolicies } from "@main/csp";

CspPolicies["api.domi-btnr.dev"] = [...(CspPolicies["api.domi-btnr.dev"] ?? []), "connect-src", "img-src"];
CspPolicies["gb.obamabot.me"] = [...(CspPolicies["gb.obamabot.me"] ?? []), "img-src"];