import components from "../components/game_components";
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

            // Initialize rank for each track
            response.forEach(track => track.rank = 0);
            setTracks(
            {
                tracklist: pairAll(response),
                tracks: response,
                index: 0
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

    /**
     * Increment the rank of a track, then prepare the next
     * tracks to compare.
     * @param {string} track the ID of the track 
     */
    function handleClick(track) {
        activeTracks[track].rank++;

        // Increment the index of the current track (find the next track to compare)
        tracks.index++;
        setActiveTracks(tracks.tracklist[tracks.index]);
    }

    function handleHide(track) {
        activeTracks[track].rank = -1;
        tracks.index++;
        removeTrack(tracks.tracklist, activeTracks[track]);
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
                        onPlay={() => handlePlayAudio(0)}
                        onMute={mute}
                        onHide={() => handleHide(0)}
                    />
                }
                {(tracks && tracks.index < tracks.tracklist.length-1 ) && 
                        <components.Counter
                            num={tracks.tracklist.length - 1 - tracks.index }
                        />
                }
                {activeTracks[1] && 
                    <components.Track
                        track={activeTracks[1]}
                        key={activeTracks[1].id}
                        onClick={() => handleClick(1)}
                        onPlay={() => handlePlayAudio(1)}
                        onMute={mute}
                        onHide={() => handleHide(1)}
                    />
                }
                {(tracks && tracks.index >= tracks.tracklist.length-1) && <components.Ranking rank={sortRank(tracks.tracks)} />}
            </components.Flex>
        </>
    )
}

function sortRank(list) {
    list.sort((track1, track2) => (track1.rank > track2.rank) ? 1 : -1);
    return list;
}

function removeTrack(tracklist, track) {
    for (const [i, pair] of tracklist.entries()) {
        if (pair.includes(track)) {
            tracklist.splice(i, 1);
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
