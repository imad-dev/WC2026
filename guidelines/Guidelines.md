## Conventions

### Naming
- React components: PascalCase (MatchCard.tsx)
- Hooks: camelCase with use prefix (useGroupStandings.ts)
- Utils: camelCase (formatDate.ts)
- Types: PascalCase with suffix where relevant (MatchStatus, ApiResponse<T>)

### Data Fetching Rules
1. Components must never call API modules directly.
2. Components must use hooks from src/hooks only.
3. Hooks must call src/api/dataOrchestrator.ts only.
4. Mock data is always the final fallback.

### Component Rules
1. Every component handles isLoading with a dedicated skeleton.
2. Every component handles isError with ErrorState and Retry.
3. Use DOMPurify.sanitize() on every dynamic innerHTML payload.
4. Do not use useEffect for data fetching. Use TanStack Query.

### Git Conventions
- Commit prefixes: feat:, fix:, refactor:, docs:, test:, chore:
- Branch naming: feature/name, fix/name, chore/name
