const parsedEnv = require(`dotenv`).config({
  path: `./.env.${process.env.NEXT_PUBLIC_RUN_MODE}`,
})

if (parsedEnv.error) {
  throw parsedEnv.error
}

// parsedEnv 변수에 로드된 환경 변수를 process.env에 추가합니다.
if (parsedEnv.parsed) {
  Object.keys(parsedEnv.parsed).forEach((key) => {
    process.env[key] = parsedEnv.parsed[key]
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
