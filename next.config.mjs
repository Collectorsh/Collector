import { withHighlightConfig } from '@highlight-run/next/config'

const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // ...additional config
}

export default withHighlightConfig(nextConfig)