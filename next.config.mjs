import { withHighlightConfig } from '@highlight-run/next/config'

const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}

export default withHighlightConfig(nextConfig)