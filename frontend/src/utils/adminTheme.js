/**
 * Returns theme-aware color constants for admin panel inline styles.
 * Use this so every admin component responds to the light/dark toggle.
 */
export const ac = (isDark) => ({
  pageBg:        isDark ? '#080808'  : '#f5f1eb',
  cardBg:        isDark ? 'linear-gradient(135deg,#111111 0%,#0a0a0a 100%)' : '#ffffff',
  cardBg2:       isDark ? '#111111'  : '#ffffff',
  cardBorder:    isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.09)',
  cardShadow:    isDark ? '0 0 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.07)',
  inputBg:       isDark ? '#111111'  : 'rgba(255,255,255,0.9)',
  inputBorder:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
  inputColor:    isDark ? '#ffffff'  : '#1a1611',
  inputPlaceholder: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,22,17,0.35)',
  text:          isDark ? '#ffffff'  : '#1a1611',
  textMuted:     isDark ? 'rgba(255,255,255,0.3)'  : 'rgba(26,22,17,0.45)',
  textFaint:     isDark ? 'rgba(255,255,255,0.15)' : 'rgba(26,22,17,0.25)',
  divider:       isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.07)',
  rowHover:      isDark ? 'rgba(255,255,255,0.015)': 'rgba(0,0,0,0.03)',
  sidebarBg:     isDark
    ? 'linear-gradient(180deg,#0f0f0f 0%,#150507 50%,#0a0a0a 100%)'
    : 'linear-gradient(180deg,#ffffff 0%,#fdf8f4 100%)',
  sidebarBorder: isDark ? 'rgba(224,30,55,0.12)' : 'rgba(224,30,55,0.18)',
  pillBg:        isDark ? '#111111'  : 'rgba(0,0,0,0.05)',
  modalBg:       isDark ? 'linear-gradient(145deg,#141414,#0c0c0c)' : '#ffffff',
  modalBorder:   isDark ? 'rgba(224,30,55,0.2)'  : 'rgba(224,30,55,0.15)',
  selectBg:      isDark ? '#1a1a1a'  : '#ffffff',
  selectColor:   isDark ? '#ffffff'  : '#1a1611',
  selectBorder:  isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
  tableHeader:   isDark ? 'rgba(255,255,255,0.25)' : 'rgba(26,22,17,0.45)',
})
