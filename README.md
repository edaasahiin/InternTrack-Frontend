InternTrack Frontend

Replace:
- src/styles/index.css
- src/utils/taskMapper.ts

Delete:
- src/interfaces/user.ts

Why:
1. Department table had an older !important width block (40% / 170% / 30%)
   that overrode the later intended 25% / 25% / 50% layout.
2. taskMapper still defined UpdateTaskDto & { isActive?: boolean } even though
   UpdateTaskDto already contains isActive?: boolean.
3. src/interfaces/user.ts is not imported anywhere in src.

After applying:
npm run typecheck
npm run lint
npm run build
