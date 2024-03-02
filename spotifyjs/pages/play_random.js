import components from "../components/game_components";
import { getTracksofPlaylist } from "./api/spotifyapi";
import { useState, useEffect, useRef } from "react";

export default function Game() {
    const [tracks, setTracks] = useState(null); // Array[object] for tracks (id, album, name, img, preview)
    const [rank, setRank] = useState([]); // Array[str] for tracks dropped first --> last 
    const [activeTracks, setActiveTracks] = useState([null, null]); // Array[str] for the active tracks
    const audio = useRef([null, null]); // Array[index] for audio

    // Initializers
    useEffect( () => {
        const album = localStorage.getItem('album');
        const fetchTracks = async () => {
            const response = await getTracksofPlaylist(album);
            setTracks(response);
        }

        fetchTracks();
    }, [])

    useEffect( () => {
        setActiveTracks(getRandomTracks(tracks));
    }, [tracks])

    useEffect( () => {
        let urls = [activeTracks[0] && activeTracks[0].preview,
                    activeTracks[1] && activeTracks[1].preview];
        audio.current = [
            {
                sound: new Audio(urls[0]),
                muted: true
            },
            {
                sound: new Audio([urls[1]]),
                muted: true
            }
        ];
    })
    
    function handleClick(track) {
        let drop = activeTracks[track === 0 ? 1 : 0];
        let next = tracks;
        drop = next.splice(tracks.indexOf(drop), 1)[0];

        setRank([...rank, drop]);
        setTracks(next);
        setActiveTracks(getRandomTracks(tracks));
    }

    function handleHide(track) {
        let index = tracks.indexOf(activeTracks[track]);
        setRank([activeTracks[track], ...rank]);
        let next = tracks;
        next.splice(index, 1);

        setTracks(next);
        setActiveTracks(getRandomTracks(tracks));
    };

    function handlePlayAudio(track) {
        // @param: track [int] -- 0 for left , 1 for right

        if (track === 1 && audio.current[track].muted) { // play audio and mute other track
            audio.current[track].sound.play();
            audio.current[track].muted = false;
            audio.current[0].sound.pause();
            audio.current[0].muted = true;
        } else if (track === 0 && audio.current[track].muted) { // play audio and mute other track
            audio.current[track].sound.play();
            audio.current[track].muted = false;
            audio.current[1].sound.pause();
            audio.current[1].muted = true;
        } else { // mute track
            audio.current[track].sound.pause();
            audio.current[track].muted = true;
        }
    }

    function mute() {
        audio.current[0].sound.pause();
        audio.current[1].sound.pause();
    }

    return (
        <>
            <components.Flex>
                {activeTracks[0] && 
                    <components.Track
                        track={activeTracks[0]}
                        key={activeTracks[0].id}
                        onClick={() => handleClick(0)}
                        onHide={() => handleHide(0)}
                        onPlay={() => handlePlayAudio(0)}
                        onMute={mute}
                    />
                }
                {(tracks && tracks.length > 1) && <components.Counter num={tracks.length-1} />}
                {activeTracks[1] && 
                    <components.Track
                        track={activeTracks[1]}
                        key={activeTracks[1].id}
                        onClick={() => handleClick(1)}
                        onHide={() => handleHide(1)}
                        onPlay={() => handlePlayAudio(1)}
                        onMute={mute}
                    />
                }
                {(tracks && tracks.length <= 1) && <components.Ranking rank={rank.concat(tracks)} />}
            </components.Flex>
        </>
    )
}

function getRandomTracks(tracks) {
    if (tracks && tracks.length >= 2) {
        let possible = [];
        possible.push(choice(tracks)); // add a random track
        possible.push(choice(tracks));

        while (possible[0] === possible[1]) { // if the tracks are the same
            possible.splice(0, 1);
            possible.push(choice(tracks));
        }
        return possible;
    }
    return [null, null];

}

function choice(list) {
    return list[Math.floor(Math.random() * list.length)];
}