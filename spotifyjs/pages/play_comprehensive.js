import { Track, Flex, Ranking, Counter } from "./game_components";
import { getTracksofPlaylist } from "./api/spotifyapi";
import { useState, useEffect, useRef } from "react";

export default function Game() {
    const [tracks, setTracks] = useState(null); // Object for tracks
    const [activeTracks, setActiveTracks] = useState([null, null]); // Array[str] for the active tracks
    const audio = useRef([null, null]); // Array[audio] for audio

    // Initializers
    useEffect( () => {
        const album = localStorage.getItem('album');
        const fetchTracks = async () => {
            const response = await getTracksofPlaylist(album);

            // Add rank to each track
           response.forEach(track => track.rank = 0);
           setTracks(
            {
                tracklist: pairAll(response),
                tracks: response,
                index: 0,
                ignore: new Set(),
                seen: 0,
            });
        }

        fetchTracks();
    }, [])

    useEffect( () => {
        if (tracks) {
            setActiveTracks(tracks.tracklist[tracks.index]);
        }
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

    function handleClick(id) {
        // @param: id of saved track
        let save = activeTracks[0] === id ? activeTracks[0] : activeTracks[1]; //? get the track to be saved
        save.rank++;
        tracks.seen++;
        console.log(tracks.seen +tracks.ignore.size);
        seekNextTrack();
        setActiveTracks(tracks.tracklist[tracks.index]);
    }

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

    function handleHide(track) {
        activeTracks[track].rank = -1;
        tracks.index++;
        removeTrack(tracks.tracklist, activeTracks[track], tracks.ignore);
        seekNextTrack();
        setActiveTracks(tracks.tracklist[tracks.index]);
    }

    function seekNextTrack() {
        tracks.index++;
        while (tracks.ignore.has(tracks.index) && tracks.index < tracks.tracklist.length) {
            tracks.index++;
        }
    }

    function mute() {
        audio.current[0].sound.pause();
        audio.current[1].sound.pause();
    }

    return (
        <>
            <Flex>
                {activeTracks[0] && 
                    <Track
                        track={activeTracks[0]}
                        key={activeTracks[0].id}
                        onClick={() => handleClick(activeTracks[0])}
                        onPlay={() => handlePlayAudio(0)}
                        onMute={mute}
                        onHide={() => handleHide(0)}
                    />
                }
                {(tracks && tracks.index < tracks.tracklist.length-1 ) && 
                        <Counter
                            num={tracks.tracklist.length-1 - tracks.seen - tracks.ignore.size} />}
                {activeTracks[1] && 
                    <Track
                        track={activeTracks[1]}
                        key={activeTracks[1].id}
                        onClick={() => handleClick(activeTracks[1])}
                        onPlay={() => handlePlayAudio(1)}
                        onMute={mute}
                        onHide={() => handleHide(1)}
                    />
                }
                {(tracks && tracks.index >= tracks.tracklist.length-1) && <Ranking rank={sortRank(tracks.tracks)} />}
            </Flex>
        </>
    )
}

function sortRank(list) {
    list.sort((track1, track2) => (track1.rank > track2.rank) ? 1 : -1);
    return list;
}

function removeTrack(tracklist, track, ignore) {
    for (const pair of tracklist) {
        if (pair.includes(track)) {
            ignore.add(tracklist.indexOf(pair));
        }
    }
}

function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]]
    }
    return list;
    
}

function pairAll(list) {
    if (list && list.length >= 2) {
        let pairs = []
        for (let i = 0; i < list.length - 1; i ++) {
            for (let j = i + 1; j < list.length; j ++) {
                pairs.push([list[i], list[j]]);
            }
        }
        pairs = shuffle(pairs);
        pairs.push([null, null]);
        return pairs;
    }
    return [null, null];
}
