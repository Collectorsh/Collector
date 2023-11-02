export const parseExternalLink = (link) => { 
  return link.includes("//") ? link : `//${ link }`
}