import Image from 'next/image';
import styles from '../styles/Game.module.css';
import { useState, useRef } from 'react';

export function Track({ track, onClick }) {
    const [playing, setPlaying] = useState(false);
    let audio = useRef(new Audio(track.preview));

    function toggle() {
        if (playing) {
            audio.current.pause();
        } else {
            audio.current.play();
        }
        setPlaying(!playing);
    }

    return (
        <Container>
            <TrackHeader name={track.name + ' * ' + track.album} onClick={toggle} />
            <TrackArt
                src={track.img.large}
                onClick={() => {playing ? toggle() : null; onClick()}}
            />
            <TrackFooter artist={track.artist}/>
        </Container>
    )
}

export function Ranking({rank}) {
    rank = rank.toReversed();
    console.log(rank[0].preview);
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

function TrackHeader({ name, onClick }) {
    return (
        <section className={[styles.description, styles.audio].join(' ')} onClick={onClick}>
            {name}
        </section>
    )
}

function TrackFooter({ artist }) {
    return (
        <section className={styles.description}>
            {artist}
        </section>
    )
}

function TrackArt({src, onClick}) {
    if (!src) {
        return null;
    }

    return (
        <Image
            className={styles.image}
            src={src}
            onClick={onClick}
            width={600}
            height={600}
            alt="track image"
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
            <p className={styles.description}>{track.name}</p>
            
        </div>
    )
}

function Container(props) {
    return(
        <section className={styles.column}>{props.children}</section>
    )
}

export function Flex(props) {
    return (
        <main className={styles.flex}>{props.children}</main>
    )
}