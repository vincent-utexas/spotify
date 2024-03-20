import Image from 'next/image';
import styles from '../styles/Game.module.css';

function Track({ track, onClick, onPlay, onMute, onHide }) {
    return (
        <Container>
            <TrackHeader name={track.name + ' * ' + track.album} />
            <TrackArt
                src={track.img.large}
                onClick={() => {onMute(); onClick()}}
            />
            <TrackFooter artist={track.artist} onPlay={onPlay} onHide={onHide} />
        </Container>
    )
}

function Ranking({ rank }) {
    rank = rank.toReversed();
    return (
        <section className={styles.ranking}>
            <div className={[styles.sticky, styles.description].join(' ')}>Your rankings:</div>
            {rank.map(track => {
                return (
                    <RankRow track={track} key={track.id} />
                )
            })}
        </section>
    )
}

function Counter({ num }) {
    return (
        <div className={[styles.description, styles.counter].join(' ')}>{num}</div>
    )
}

function TrackHeader({ name }) {
    return (
        <section className={styles.description}>
            {name}
        </section>
    )
}

function TrackFooter({ artist, onPlay, onHide }) {
    return (
        <section className={styles.footer}>
            <p className={styles.description}>{artist}</p>
            <p className={styles.audio_button} onClick={onPlay}>(play)</p>
            <p className={styles.audio_button} onClick={onHide}>(hide)</p>
        </section>
    )
}

function TrackArt({src, onClick}) {
    if (!src) {
        return null;
    }

    return (
        <img
            className={styles.image}
            src={src}
            onClick={onClick}
        />
    )

}

function RankRow({ track }) {
    return (
        <div className={[styles.card, styles.row].join(' ')}>
            <Image 
                src={track.img.small}
                width={60}
                height={60}
                alt='track'
            />
            <p className={styles.description}>{track.name} * {track.artist}</p>
            
        </div>
    )
}

function Container(props) {
    return(
        <section className={styles.column}>{props.children}</section>
    )
}

function Flex(props) {
    return (
        <main className={styles.flex}>{props.children}</main>
    )
}

export default {Track, Ranking, Counter, Flex};