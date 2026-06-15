/**
 * Universal safe image retriever for Hobe Gorilla Rwanda.
 * Replaces old hashed asset strings or un-prefixed filenames with correct public image paths,
 * and adaptively makes absolute endpoints relative to the current location to support
 * subdirectory hosting (like VS Code Live Server, /dist/ folder previews) and multi-page configurations.
 */
export const getAdaptiveImageUrl = (url?: string): string => {
  if (!url) return '';
  
  let cleanUrl = url.trim();
  const lowercase = cleanUrl.toLowerCase();
  
  // 1. Map known keywords to exact public image paths
  if (lowercase.includes('mountain_gorilla')) {
    cleanUrl = '/images/mountain_gorilla.jpg';
  } else if (lowercase.includes('golden_monkey')) {
    cleanUrl = '/images/golden_monkey.jpg';
  } else if (lowercase.includes('chimpanzee_nyungwe') || lowercase.includes('chimpanzee')) {
    cleanUrl = '/images/chimpanzee_nyungwe.jpg';
  } else if (lowercase.includes('akagera_safari') || lowercase.includes('akagera')) {
    cleanUrl = '/images/akagera_safari.jpg';
  } else if (lowercase.includes('nyungwe_forest') || lowercase.includes('nyungwe')) {
    cleanUrl = '/images/nyungwe_forest.jpg';
  } else if (lowercase.includes('lake_kivu_sunset') || lowercase.includes('lake_kivu')) {
    cleanUrl = '/images/lake_kivu_sunset.jpg';
  } else if (lowercase.includes('twin_lakes_rwanda') || lowercase.includes('twin_lakes')) {
    cleanUrl = '/images/twin_lakes_rwanda.jpg';
  } else if (lowercase.includes('luxury_lodge') || lowercase.includes('luxury')) {
    cleanUrl = '/images/luxury_lodge.jpg';
  } else if (lowercase.includes('hobe-icon.png')) {
    cleanUrl = '/hobe-icon.png';
  } else {
    // Substitute standard legacy patterns
    cleanUrl = cleanUrl
      .replace(/^(\.\.\/)?(src\/)?(assets\/images\/)/i, '/images/')
      .replace(/^\/?assets\/images\//i, '/images/');
  }

  // Ensure leading slash for uniform calculation
  if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = '/' + cleanUrl;
  }

  // 2. Adjust path depth dynamically depending on location to bypass subdirectory breaks
  try {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);

    // If protocol is file, make it fully relative to bypass absolute path drive resolution
    if (window.location.protocol === 'file:') {
      const isSubPage = segments.some(seg => 
        ['destinations', 'packages', 'booking', 'bookings-hub', 'conservation', 'admin', 'privacy', 'terms'].includes(seg)
      );
      if (isSubPage) {
        return '../' + cleanUrl.slice(1);
      }
      return cleanUrl.slice(1); // 'images/name.jpg' or 'hobe-icon.png'
    }

    // Identify standard routed folders
    const isSubPage = segments.some(seg => 
      ['destinations', 'packages', 'booking', 'bookings-hub', 'conservation', 'admin', 'privacy', 'terms'].includes(seg)
    );
    
    // Double subpath like "/destinations/volcanoes-np"
    const isTwoLevelsDeep = isSubPage && segments.length > 1 && segments[segments.length - 2] === 'destinations';

    if (isTwoLevelsDeep) {
      return '../../' + cleanUrl.slice(1);
    } else if (isSubPage) {
      return '../' + cleanUrl.slice(1);
    }
    
    // If we are at the root index (or a root subdirectory like /dist/), making it starting with
    // no leading slash 'images/...' resolves perfectly relative to that folder!
    return cleanUrl.slice(1);
  } catch (e) {
    return cleanUrl;
  }
};
