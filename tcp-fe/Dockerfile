# -------- deps --------
FROM node:20-alpine AS deps
WORKDIR /app

# pnpm 사용 -> nodejs에 내장된 패키지 관리 활성화
RUN corepack enable && corepack prepare pnpm@latest --activate

# 의존성 파일만 먼저 복사 (캐시 최적화) `
COPY package.json pnpm-lock.yaml ./
# pnpm workspace 쓰면 이것도 필요할 수 있음


# 의존성 설치
RUN pnpm install --frozen-lockfile

# -------- build --------
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml ./
COPY . .

# Next.js 빌드
RUN pnpm build

# -------- runner --------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@latest --activate

# 운영 실행에 필요한 것만 복사
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Next.js 런타임 산출물
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# (중요) next start는 런타임 deps 필요
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3001
CMD ["pnpm", "start", "-p", "3001"]
