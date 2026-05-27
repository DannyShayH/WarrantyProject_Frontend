import styles from './CardStack.module.css'

const DEMO_CARDS = [
    { title: 'Sony WH-1000XM5', timeLeft: '1y 4m left', urgency: 'ok' },
    { title: 'Dyson V15',        timeLeft: '2m left',    urgency: 'soon' },
    { title: 'LG OLED C3 TV',   timeLeft: '3y 8m left', urgency: 'ok' },
]

export default function CardStack() {
    return (
        <div style={{ display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'relative', width: 460, height: 460 }}>
                <div className={styles.glow} />
                {DEMO_CARDS.map((card, i) => {
                    const isWarn = card.urgency === 'soon'
                    const badgeColor  = isWarn ? 'var(--warn)'                  : 'var(--green-b)'
                    const badgeBg     = isWarn ? 'rgba(250,184,40,0.14)'        : 'rgba(137,222,159,0.14)'
                    const badgeBorder = isWarn ? '1px solid rgba(250,184,40,0.4)' : '1px solid rgba(137,222,159,0.4)'

                    return (
                        <div
                            key={card.title}
                            className={styles.card}
                            style={{
                                left: 40 + i * 22,
                                top: 80 + i * 100,
                                '--rot': `${(i - 1) * 2}deg`,
                                animation: `wt-card-hover ${5 + i * 0.7}s ease-in-out infinite`,
                                animationDelay: `${i * 0.4}s`,
                            }}
                        >
                            <div>
                                <div className={styles.eyebrow}>WARRANTY</div>
                                <div className={styles.name}>{card.title}</div>
                                <div className={styles.badge} style={{ color: badgeColor, background: badgeBg, border: badgeBorder }}>
                                    {card.timeLeft}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}