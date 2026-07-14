# Social Media Manager MCP

**The operational layer for running accounts — yours or your clients'. Calendars, cadence, captions, hashtags, engagement, metrics, and client reporting.**

> **Disclaimer.** Structured social-management frameworks from documented practice. Cadence and metric ranges are current-practice guidance, not platform guarantees.

## Why This Exists

Content-hooks writes the post and personal-brand sets the positioning — but someone has to RUN the account: plan the calendar, keep the cadence, write the captions, manage the community, read the metrics, and report to the client. That's the SMM's actual daily job, and this MCP is the operating system for it.

## 7 Tools

| Tool | What it returns |
|---|---|
| `get_posting_cadence` | Frequency, best windows, key note per platform (TikTok, IG, LinkedIn, X, YouTube) |
| `build_content_calendar` | Pillar-first weekly shape, batch-by-task rule, conversion ratio |
| `get_caption_framework` | Caption structures by goal (hook-expand-CTA, story, list, question-seed) |
| `get_hashtag_strategy` | Count, mix, and note per platform |
| `get_engagement_playbook` | First-hour replies, threading, pinned comments, DMs, outbound engagement, handling negativity |
| `interpret_metric` | What each metric means + what to do (reach, engagement rate, saves, shares, retention, growth, profile-visit-to-follow) |
| `get_client_report_template` | The 5-part client report + report-on-the-goal rule |
| `get_full_pack` | Everything in one payload |

## Install
```bash
npx social-media-manager-mcp
```
```json
{ "mcpServers": { "social-media-manager": { "command": "npx", "args": ["social-media-manager-mcp"] } } }
```

## The Family
Runs on top of [content-hooks-mcp](https://github.com/closermethod/content-hooks-mcp) (post copy), [content-repurposing-mcp](https://github.com/closermethod/content-repurposing-mcp) (feed the calendar), and [personal-brand-mcp](https://github.com/closermethod/personal-brand-mcp) (positioning). Full catalog: [MCP Hub](https://elisabethhitz-mcp.netlify.app)

## Built By
[Elisabeth Hitz](https://www.linkedin.com/in/elisabethhitz) — 10+ years enterprise sales, reverse-engineered for creators.

License: MIT
