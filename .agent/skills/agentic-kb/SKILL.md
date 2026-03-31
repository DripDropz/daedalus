---
name: agentic-kb
description: "Search the Daedalus knowledge base for docs, code patterns, issues, and PRs. Use this as your FIRST step for any comprehension, research, context-gathering, planning, implementation, critique, or code review task."
allowed-tools:
  - daedalus-agentic-search:search
  - daedalus-agentic-search:search_docs
  - daedalus-agentic-search:search_code
  - daedalus-agentic-search:search_github
  - daedalus-agentic-search:get_entity
  - daedalus-agentic-search:find_related
  - daedalus-agentic-search:kb_status
disable-model-invocation: false
user-invocable: true
---

# Agentic Knowledge Base Skill

> **IMPORTANT: Always check KB first** — Before reading files, running grep, or launching explore agents, attempt at least one KB search. The KB contains indexed project knowledge that can often answer questions directly without diving into source code.

Use this skill for comprehension, research, planning, implementation, debugging, or any code exploration task. The KB contains indexed docs, code, GitHub issues, PRs, and project context.

## When to use

- When asked to explain, understand, or summarize how something works
- When planning, designing, or architecting new features
- When reviewing code or critiquing implementations
- When researching any topic in the codebase
- Before implementing new features (find prior art, existing patterns)
- When debugging (find related issues, PR discussions, past solutions)
- When exploring unfamiliar code areas (read project conventions)
- When you need to understand architectural decisions (find relevant docs)
- When onboarding to a new area (search for related issues and PRs)
- When writing or updating documentation

## KB-First Workflow

### Step 1: Check KB Readiness
```bash
# Verify the KB is running and responsive
kb_status
```

If `kb_status` returns an error or unreachable, fall back to direct file reading.

### Step 2: Search the Relevant Corpus

| Task | Tool | Example |
|------|------|---------|
| General search | `search` | `search "staking reward withdrawal"` |
| Project docs only | `search_docs` | `search_docs "hardware wallet ledger"` |
| Code patterns only | `search_code` | `search_code "cardano-cli transaction build"` |
| GitHub issues/PRs | `search_github` | `search_github "UTxO error"` |

### Step 3: Verify Against Source

KB findings reflect indexed snapshots. Always cross-reference with current source:
- Read relevant files directly
- Check for newer changes not yet synced
- Validate the information is still accurate

### Step 4: Report and Use

- Summarize KB findings for the user
- Link to relevant source paths from KB results
- Note any discrepancies between KB and current source

## Operating Rules (must follow)

- **Search KB before asking** about code patterns, past implementations, or architectural decisions
- **Verify findings** against current source when making code changes
- **Report KB errors** if the server is unreachable — do not silently fail
- **Use appropriate corpus** — `search_docs` for documentation, `search_code` for code patterns, `search_github` for issues
- **Respect the snapshot** — KB reflects a point-in-time snapshot; inform users when findings may be stale

## MCP Tools

### search
Hybrid BM25/vector search across all KB corpora.
```
search "mithril bootstrap"
```

### search_docs
Search project documentation only.
```
search_docs "i18n translation"
```

### search_code
Search code patterns and implementations.
```
search_code "createWallet API"
```

### search_github
Search GitHub issues, PRs, and comments.
```
search_github "ledger signing"
```

### get_entity
Fetch one indexed row by type and stable ID.
```
get_entity documents ".agent/workflows/agentic-kb.md"
```

### find_related
Find related KB entities from a known entity ID.
```
find_related code "cardano-wallet-launcher"
```

### kb_status
Check KB readiness and embedding compatibility.
```
kb_status
```

## Query Strategies

### Effective Searches
- Use **specific terms** — "UTxO balance" not " stuff with the thing"
- Use **quotes for phrases** — `"cardano-cli transaction build"` for exact matches
- **Iterate** — start broad, then narrow with filters
- **Include context** — "API client error" not just "error"

### Filtering
Use `--entity-type`, `--mode bm25|vector|hybrid`, and `--filter key=value` flags as needed.

### When Search Returns Nothing
1. Try alternate terms or synonyms
2. Try broader phrasing
3. Search a different corpus (docs vs code vs github)
4. Fall back to direct file reading and grep

## Relationship to Other Skills

This skill is orthogonal to domain skills (cardano-cli-*, storybook-creation, etc.). Use it to:
- Find context before using domain skills
- Search for patterns that inform which skill to use
- Cross-reference findings from domain skills with prior KB entries

## References

- [Agentic KB Workflow](../.agent/workflows/agentic-kb.md) — operator source of truth
- [agentic/README.md](../agentic/README.md) — MCP setup examples
