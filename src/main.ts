#!/usr/bin/env node
/**
 * Social Media Manager MCP Server v1.0
 * By Elisabeth Hitz — the operational layer for social media managers.
 *
 * 7 tools for running accounts (your own or clients'): content calendars, posting
 * cadence, caption frameworks, hashtag strategy, community/engagement playbooks,
 * metric interpretation, and client reporting.
 *
 * Content-hooks-mcp writes the post; personal-brand-mcp sets the positioning;
 * content-repurposing-mcp feeds the calendar. This server RUNS the account: the
 * daily/weekly operating system an SMM actually executes.
 *
 * This MCP does NOT set rates or discuss pricing.
 *
 * DISCLAIMER: Structured social-management frameworks from documented practice.
 * Cadence and metric ranges are current-practice guidance, not platform guarantees.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const MCP_META = {
  server: "social-media-manager-mcp",
  version: "1.0.0",
  last_verified: "2026-Q3",
  author: "Elisabeth Hitz",
  homepage: "https://elisabethhitz.com",
  github: "https://github.com/closermethod/social-media-manager-mcp",
  family_note: "Part of the closermethod creator MCP family. Runs on top of content-hooks-mcp (post copy), content-repurposing-mcp (feed the calendar), and personal-brand-mcp (positioning)."
} as const;

// =====================================================
// POSTING CADENCE
// =====================================================
const CADENCE: Record<string, any> = {
  tiktok: { frequency: "1/day minimum for growth; 3-5/week to stay alive", best_windows: "Test your own audience; general: early morning, lunch, evening", note: "Volume + consistency beat perfection. The algorithm rewards regular posting and native format." },
  instagram: { frequency: "3-5 reels/week + regular stories", best_windows: "Lunch and evening on weekdays", note: "Reels for reach, stories for warm audience, carousels for saves. Grid perfection is a trap." },
  linkedin: { frequency: "2-4/week", best_windows: "Tue-Thu mornings", note: "Native text/document/video outperform links. One idea per post." },
  x: { frequency: "1-3 real posts/day + replies", best_windows: "Spread across the day; morning + evening", note: "Replies to bigger accounts drive more reach than posting alone. Daily presence > scheduled bursts." },
  youtube: { frequency: "1/week sustained (long) + shorts as fuel", best_windows: "Consistent day/time builds the habit", note: "Search + suggested driven; the only platform where old content keeps working." }
};

// =====================================================
// CONTENT CALENDAR
// =====================================================
const CALENDAR_SYSTEM = {
  pillars_first: "Assign every slot to a content pillar (receipts / method / story / conversion) so the mix stays balanced, not random.",
  weekly_shape: [
    { slot: "Mon", role: "Authority / method — teach one thing" },
    { slot: "Tue", role: "Receipt / proof — a result, number, or case" },
    { slot: "Wed", role: "Reach play — trend-aware or high-hook format" },
    { slot: "Thu", role: "Story / behind-the-scenes — build the parasocial bond" },
    { slot: "Fri", role: "Engagement / community — question, poll, reply-bait (the good kind)" },
    { slot: "Weekend", role: "Lighter / repurposed — carousel, roundup, or rest" }
  ],
  batching_rule: "Batch by task, not by day: script all week's hooks in one sitting, film in one session, edit in one, schedule in one. Context-switching is the tax.",
  ratio: "Keep conversion content ~10-20% of slots. The other 80% earns the right to convert. Selling every post kills the account."
};

// =====================================================
// CAPTION FRAMEWORKS
// =====================================================
const CAPTION_FRAMEWORKS: Record<string, any> = {
  hook_expand_cta: { structure: "Line 1: restate/sharpen the hook. Middle: expand or add the receipt. End: ONE call to action.", when: "Standard video caption.", rule: "First line must earn the '...more' tap on its own." },
  story: { structure: "Open mid-scene → tension → turn → what it means for the reader → soft CTA.", when: "Storytime, behind-the-scenes, LinkedIn.", rule: "Every named detail must pay off. No CTA-stuffing." },
  list: { structure: "Promise (N things) → the list, one line each → 'save this for [moment]'.", when: "Carousels, tips, reference content.", rule: "Reference value drives saves; make it skimmable." },
  question_seed: { structure: "Context → a genuinely answerable, opinion-y question.", when: "When you want comments (the algorithm's favorite signal).", rule: "'flat fee or per-click?' beats 'thoughts?'. Low effort, high opinion." }
};

// =====================================================
// HASHTAG STRATEGY
// =====================================================
const HASHTAG_STRATEGY: Record<string, any> = {
  tiktok: { count: "3-5", mix: "1 broad, 2-3 niche, 1 content-specific", note: "Hashtags matter less than the hook + watch time. Don't stuff." },
  instagram: { count: "3-8 (quality over 30)", mix: "small + medium + a couple large; rotate sets", note: "Ranking is content+engagement first. Hashtags aid discovery, not save a weak post." },
  linkedin: { count: "3-5", mix: "professional/topical", note: "Used for topic classification more than reach." },
  x: { count: "0-1", mix: "rarely helps", note: "X hashtags mostly hurt readability. Skip unless a real campaign tag." },
  youtube: { count: "#shorts + 2-3 topical", mix: "topical for classification", note: "The TITLE is the real SEO, not hashtags." }
};

// =====================================================
// ENGAGEMENT / COMMUNITY PLAYBOOK
// =====================================================
const ENGAGEMENT_PLAYBOOK = {
  first_hour: "Reply to every comment in the first 60-90 min. Early engagement signals the algorithm to push wider.",
  reply_to_reply: "Turn comments into threads — reply, ask a follow-up. Depth of conversation is a ranking signal.",
  pinned_comment: "Pin your CTA or the best question as the first comment to steer the thread.",
  dms: "Treat DMs as the warmest channel. A real reply beats an automation. This is where relationships (and deals) start.",
  outbound_engagement: "Spend 15 min/day commenting (value, not 'great post!') on adjacent accounts. Borrowed reach.",
  handling_negativity: "Ignore trolls, engage genuine criticism once, delete only spam/hate. Don't feed rage in the thread."
};

// =====================================================
// METRIC INTERPRETATION
// =====================================================
const METRIC_READS: Record<string, any> = {
  reach: { means: "How many unique accounts saw it. Reach without follows/engagement = a hook that entertains but doesn't convert to relationship.", fix: "Tighten the content promise + bio so viewers have a reason to stay." },
  engagement_rate: { means: "Interactions ÷ reach. The health signal. Low + high reach = mismatched audience or weak content.", fix: "If low across the board, the content isn't landing with WHO it's reaching. Re-check targeting/positioning." },
  saves: { means: "Reference value — people want to come back to it. High saves = teach/list content working.", fix: "Make more reference-grade content; add explicit 'save this for [moment]'." },
  shares: { means: "Identity value — it says something about the sharer. The strongest growth signal.", fix: "Add point-of-view content; people share what represents them." },
  watch_time_retention: { means: "Did they stay? The single biggest short-form ranking factor.", fix: "If drop-off is early, it's a HOOK problem. If late, tighten the middle / add payoffs." },
  follower_growth: { means: "Net new followers. Read NET of unfollows.", fix: "Views up but follows flat = no reason to subscribe. Sharpen the recurring content promise." },
  profile_visits_to_follow: { means: "Did viewers who clicked the profile follow? Tests the bio + grid.", fix: "Low ratio = bio/positioning problem, not a content problem." }
};

// =====================================================
// CLIENT REPORTING
// =====================================================
const CLIENT_REPORT = {
  structure: [
    "1. Headline: the ONE number that moved and why (not a data dump).",
    "2. What we posted (count by pillar) and what performed best (+ why).",
    "3. The 3 metrics that matter for THIS client's goal (reach for awareness, saves/shares for authority, profile-visits/link-clicks for conversion).",
    "4. One learning → one change for next period.",
    "5. Next period plan (so the report ends forward-looking, not backward)."
  ],
  rule: "Report on the goal, not vanity metrics. A client who wants leads doesn't care about impressions; show them profile visits and link clicks.",
  cadence: "Monthly full report + a light weekly pulse. Don't surprise a client at month-end."
};

// =====================================================
// MCP SERVER
// =====================================================
const server = new Server({ name: "social-media-manager-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_posting_cadence",
      description: "Posting frequency, best windows, and the key note per platform: tiktok, instagram, linkedin, x, youtube. Omit platform for all.",
      inputSchema: { type: "object", properties: { platform: { type: "string", enum: Object.keys(CADENCE) } } }
    },
    {
      name: "build_content_calendar",
      description: "The content-calendar system: pillar-first assignment, a weekly shape (Mon authority → Fri engagement), the batch-by-task rule, and the conversion ratio. Use to plan a week/month for an account.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_caption_framework",
      description: "Caption structures by goal: hook_expand_cta, story, list, question_seed. Each with structure, when to use, and the rule. Omit for all.",
      inputSchema: { type: "object", properties: { framework: { type: "string", enum: Object.keys(CAPTION_FRAMEWORKS) } } }
    },
    {
      name: "get_hashtag_strategy",
      description: "Hashtag count, mix, and note per platform: tiktok, instagram, linkedin, x, youtube. Omit for all.",
      inputSchema: { type: "object", properties: { platform: { type: "string", enum: Object.keys(HASHTAG_STRATEGY) } } }
    },
    {
      name: "get_engagement_playbook",
      description: "The community/engagement playbook: first-hour replies, reply-to-reply threading, pinned comments, DM handling, outbound engagement, handling negativity.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "interpret_metric",
      description: "What a social metric means and what to do about it: reach, engagement_rate, saves, shares, watch_time_retention, follower_growth, profile_visits_to_follow. Omit for all.",
      inputSchema: { type: "object", properties: { metric: { type: "string", enum: Object.keys(METRIC_READS) } } }
    },
    {
      name: "get_client_report_template",
      description: "How to report to a client: the 5-part structure, the report-on-the-goal rule, and the cadence. For SMMs managing client accounts.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_full_pack",
      description: "The complete SMM library in one payload: cadence, calendar, caption frameworks, hashtag strategy, engagement playbook, metric reads, client reporting.",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args as any;
  const wrap = (obj: any) => ({ content: [{ type: "text" as const, text: JSON.stringify({ ...obj, _meta: MCP_META }, null, 2) }] });

  if (name === "get_posting_cadence") {
    if (a.platform) { const c = CADENCE[a.platform]; return c ? wrap({ platform: a.platform, ...c }) : wrap({ error: "Unknown platform. See enum." }); }
    return wrap({ cadence: CADENCE });
  }
  if (name === "build_content_calendar") return wrap(CALENDAR_SYSTEM);
  if (name === "get_caption_framework") {
    if (a.framework) { const f = CAPTION_FRAMEWORKS[a.framework]; return f ? wrap({ framework: a.framework, ...f }) : wrap({ error: "Unknown framework. See enum." }); }
    return wrap({ frameworks: CAPTION_FRAMEWORKS });
  }
  if (name === "get_hashtag_strategy") {
    if (a.platform) { const h = HASHTAG_STRATEGY[a.platform]; return h ? wrap({ platform: a.platform, ...h }) : wrap({ error: "Unknown platform. See enum." }); }
    return wrap({ strategy: HASHTAG_STRATEGY });
  }
  if (name === "get_engagement_playbook") return wrap(ENGAGEMENT_PLAYBOOK);
  if (name === "interpret_metric") {
    if (a.metric) { const m = METRIC_READS[a.metric]; return m ? wrap({ metric: a.metric, ...m }) : wrap({ error: "Unknown metric. See enum." }); }
    return wrap({ metrics: METRIC_READS });
  }
  if (name === "get_client_report_template") return wrap(CLIENT_REPORT);
  if (name === "get_full_pack") return wrap({ pack: "Social Media Manager MCP — Complete Library v1.0", author: "Elisabeth Hitz", modules: { cadence: CADENCE, calendar_system: CALENDAR_SYSTEM, caption_frameworks: CAPTION_FRAMEWORKS, hashtag_strategy: HASHTAG_STRATEGY, engagement_playbook: ENGAGEMENT_PLAYBOOK, metric_reads: METRIC_READS, client_report: CLIENT_REPORT } });
  return wrap({ error: "Unknown tool" });
});

const transport = new StdioServerTransport();
await server.connect(transport);
