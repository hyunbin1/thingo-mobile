# App Router Draft

## Goal
- Use Expo Router's `app/` directory as the primary routing source of truth
- Prefer readable, resource-oriented route names over direct web route copying
- Keep route entry files small and move only route-local UI into `_components` or `_sections` when needed

## Naming rules
- Use plural resource names for collections: `posts`, `departments`, `events`
- Use domain-specific param names instead of generic `uuid`: `postId`, `userId`, `departmentPostId`
- Prefer nested resource paths that read naturally:
  - `/posts/[postId]`
  - `/posts/[postId]/edit`
  - `/departments/posts/[departmentPostId]`

## Draft structure
```text
app/
  _layout.tsx
  +not-found.tsx
  +html.tsx

  index.tsx

  posts/
    index.tsx
    write/
      index.tsx
    [postId]/
      index.tsx
      edit/
        index.tsx

  profile/
    index.tsx
    [userId]/
      index.tsx
      edit/
        index.tsx
    withdraw/
      index.tsx
    my-posts/
      [userId]/
        index.tsx
    my-comments/
      [userId]/
        index.tsx
    my-likes/
      [userId]/
        index.tsx

  search/
    index.tsx

  departments/
    posts/
      new/
        index.tsx
      [departmentPostId]/
        index.tsx
        edit/
          index.tsx
    events/
      new/
        index.tsx
      [departmentEventId]/
        edit/
          index.tsx

  login/
    index.tsx
  register/
    index.tsx
  find-password/
    index.tsx

  map/
    index.tsx
```

## Web route mapping
- `/` -> `app/index.tsx`
- `/board/:uuid` -> `app/posts/[postId]/index.tsx`
- `/board/write` -> `app/posts/write/index.tsx`
- `/board/edit/:uuid` -> `app/posts/[postId]/edit/index.tsx`
- `/mypage` -> `app/profile/index.tsx`
- `/mypage/:uuid` -> `app/profile/[userId]/index.tsx`
- `/mypage/:uuid/edit` -> `app/profile/[userId]/edit/index.tsx`
- `/mypage/withdraw` -> `app/profile/withdraw/index.tsx`
- `/mypage/my-post/:uuid` -> `app/profile/my-posts/[userId]/index.tsx`
- `/mypage/my-comment/:uuid` -> `app/profile/my-comments/[userId]/index.tsx`
- `/mypage/my-likes/:uuid` -> `app/profile/my-likes/[userId]/index.tsx`
- `/search` -> `app/search/index.tsx`
- `/departments/posts/:uuid` -> `app/departments/posts/[departmentPostId]/index.tsx`
- `/departments/posts/new` -> `app/departments/posts/new/index.tsx`
- `/departments/posts/edit/:uuid` -> `app/departments/posts/[departmentPostId]/edit/index.tsx`
- `/departments/events/new` -> `app/departments/events/new/index.tsx`
- `/departments/events/edit/:uuid` -> `app/departments/events/[departmentEventId]/edit/index.tsx`
- `/login` -> `app/login/index.tsx`
- `/register` -> `app/register/index.tsx`
- `/find-password` -> `app/find-password/index.tsx`

## Local structure guidance
- Keep route entry files focused on navigation options, params extraction, and top-level composition
- Keep route-specific sections near the route instead of forcing them into shared folders
- Promote UI to `shared/ui` only after it is reused by multiple unrelated routes
