import backdropStyles from './Backdrop.module.css'
import pillStyles from './PillButton.module.css'
import fieldStyles from './Field.module.css'
import footerStyles from './Footer.module.css'
import sectionStyles from './SectionHeader.module.css'
import authStyles from './AuthShell.module.css'
import gateStyles from './RequireLogin.module.css'
import navStyles from './TopNav.module.css'

export function Backdrop({ variant = 'hero' }) {
  const orbSets = {
    hero: [
      { left: '62%',  top: '10%',  w: 900, h: 900, op: 0.55, blur: 80,
        grad: 'radial-gradient(circle, var(--green-b) 0%, var(--green-a) 45%, transparent 75%)' },
      { left: '8%',   top: '55%',  w: 600, h: 600, op: 0.18, blur: 90,
        grad: 'radial-gradient(circle, var(--green-soft) 0%, transparent 70%)' },
    ],
    soft: [
      { left: '65%',  top: '-10%', w: 800, h: 800, op: 0.32, blur: 90,
        grad: 'radial-gradient(circle, var(--green-b) 0%, var(--green-a) 45%, transparent 75%)' },
      { left: '-5%',  top: '50%',  w: 600, h: 600, op: 0.14, blur: 100,
        grad: 'radial-gradient(circle, var(--green-soft) 0%, transparent 70%)' },
    ],
    flat: [
      { left: '-10%', top: '-15%', w: 700, h: 700, op: 0.35, blur: 80,
        grad: 'radial-gradient(circle, rgba(137,222,159,0.35) 0%, transparent 70%)' },
      { left: '75%',  top: '55%',  w: 600, h: 600, op: 0.35, blur: 80,
        grad: 'radial-gradient(circle, rgba(74,120,86,0.45) 0%, transparent 70%)' },
    ],
  }
  const orbs = orbSets[variant] ?? orbSets.hero

  return (
    <div className={backdropStyles.backdrop}>
      <div className={backdropStyles.grid} />
      {orbs.map((o, i) => (
        <div key={i} className={backdropStyles.orb} style={{
          left: o.left, top: o.top, width: o.w, height: o.h,
          opacity: o.op, background: o.grad, filter: `blur(${o.blur}px)`,
        }} />
      ))}
      <svg className={backdropStyles.noise}>
        <filter id="wt-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#wt-noise)" />
      </svg>
      <div className={backdropStyles.vignette} />
    </div>
  )
}

export function Logo({ onClick }) {
  return (
    <button className={navStyles.logo} onClick={onClick}>
      Warrantour
    </button>
  )
}

export function NavLink({ active, children, onClick }) {
  return (
    <button
      className={`${navStyles.navLink}${active ? ` ${navStyles.navLinkActive}` : ''}`}
      onClick={onClick}
    >
      {children}
      {active && <span className={navStyles.navLinkUnderline} />}
    </button>
  )
}

export function PillButton({ children, onClick, variant = 'primary', size = 'md', style, type, disabled }) {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`${pillStyles.pill} ${pillStyles[size]} ${pillStyles[variant]}`}
      style={style}
    >
      {children}
    </button>
  )
}

export function Field({ label, required, hint, error, children }) {
  return (
    <div className={fieldStyles.field}>
      <span className={`${fieldStyles.label}${required ? ` ${fieldStyles.labelRequired}` : ''}`}>
        {label}
      </span>
      {children}
      {error
        ? <span className={fieldStyles.error}>{error}</span>
        : hint
        ? <span className={fieldStyles.hint}>{hint}</span>
        : null}
    </div>
  )
}

export function Input({ value, onChange, placeholder, type = 'text', error, ...rest }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className={`${fieldStyles.input}${error ? ` ${fieldStyles.inputError}` : ''}`}
      {...rest}
    />
  )
}

export function TextArea({ value, onChange, placeholder, error, rows = 5 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${fieldStyles.textarea}${error ? ` ${fieldStyles.textareaError}` : ''}`}
    />
  )
}

export function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <span>© 2026 Warrantour — Track. Store. Claim.</span>
      <nav className={footerStyles.links}>
        <a href="#contact">Help</a>
        <a href="#contact">Privacy</a>
        <a href="#contact">Terms</a>
      </nav>
    </footer>
  )
}

export function SectionHeader({ num, title, subtitle }) {
  return (
    <div className={sectionStyles.header}>
      <span className={sectionStyles.num}>{num}</span>
      <div>
        <div className={sectionStyles.title}>{title}</div>
        {subtitle && <div className={sectionStyles.sub}>{subtitle}</div>}
      </div>
    </div>
  )
}

export function AuthShell({ title, subtitle, children, footer, bullets }) {
  return (
    <div className={authStyles.grid}>
      <section>
        <h1 style={{ fontFamily: 'var(--font)', fontSize: 64, color: '#fff', lineHeight: 1.05, fontWeight: 500 }}>
          {title}
        </h1>
        <p style={{ fontFamily: 'var(--font)', fontSize: 22, color: 'var(--ink-dim)', marginTop: 18, lineHeight: 1.4, maxWidth: 520 }}>
          {subtitle}
        </p>
        {bullets && (
          <ul className={authStyles.bullets}>
            {bullets.map(b => (
              <li key={b.title} className={authStyles.bullet}>
                <span className={authStyles.bulletCheck}>✓</span>
                <div>
                  <div className={authStyles.bulletTitle}>{b.title}</div>
                  <div className={authStyles.bulletBody}>{b.body}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 28, fontFamily: 'var(--font)', fontSize: 16, color: 'var(--ink-dim)' }}>
          {footer}
        </div>
      </section>

      <section className={authStyles.card}>
        {children}
      </section>
    </div>
  )
}

export function RequireLogin({ go }) {
  return (
    <div className={gateStyles.gate}>
      <div className={gateStyles.card}>
        <h2 className={gateStyles.title}>gotta log in first 👀</h2>
        <p className={gateStyles.body}>you'll need an account to see this</p>
        <div className={gateStyles.btns}>
          <PillButton onClick={() => go('login')}>Login</PillButton>
          <PillButton variant="ghost" onClick={() => go('signup')}>Sign up</PillButton>
        </div>
      </div>
    </div>
  )
}