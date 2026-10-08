// Shared footer destinations supplied by Ellis Services Group.
export const footerSocialLinks = [
  { label: 'Google Reviews', href: 'https://share.google/y50AZRJwjOdVOlj5o', icon: 'google-g.png', brand: 'google' },
  { label: 'Instagram', href: 'https://www.instagram.com/elliservices_group/', icon: 'instagram-small.png', brand: 'instagram' },
  { label: 'LinkedIn', href: 'https://share.google/Z4tImXHToPi9H4LmH', icon: 'linkedin.svg', brand: 'linkedin' },
  { label: 'Facebook', href: 'https://share.google/tU1c5vEAlELqXCifu', icon: 'facebook.svg', brand: 'facebook' }
];

export function footerSocial() {
  return `<div class="footer-social"><p class="footer-social-title">Follow Ellis · Canberra</p><nav class="footer-social-links" aria-label="Ellis social profiles and Google reviews">${footerSocialLinks.map(item => `<a class="footer-social-link" href="${item.href}" target="_blank" rel="noopener noreferrer"><img class="social-icon social-icon-${item.brand}" src="/assets/${item.icon}" alt="" width="16" height="16">${item.label}</a>`).join('')}</nav></div>`;
}
