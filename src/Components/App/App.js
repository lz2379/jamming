import './App.css';
import React from "react";

import {Spotify} from "../../util/Spotify.js";
import {Playlist} from '../Playlist/Playlist.js';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchResults: [
        {name:'A1', artist:'AAA1', album: 'AAAA1', id:1},
        {name:'A2', artist:'AAA2', album: 'AAAA2', id:2}],
      playlistName: "New Playlist",
      playlistTracks: [
        {name:'A3', artist:'AAA3', album: 'AAAA3', id:3},
        {name:'A4', artist:'AAA4', album: 'AAAA4', id:4}],
    }
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }
  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
      return;   
    }   
    let newplaylist=this.state.playlistTracks;
    newplaylist.push(track);
    this.setState({playlistTracks: newplaylist});
  }
  removeTrack(track){
    let newplaylist=this.state.playlistTracks;
    newplaylist=newplaylist.filter((savedTrack)=>savedTrack.id!==track.id);
    this.setState({playlistTracks:newplaylist});
  }
  updatePlaylistName(name){
    this.setState({playlistName:name});
  }
  savePlaylist(){
    let trackURIs=this.state.playlistTracks.map((track)=>track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>
      this.setState({
        playlistName:'New Playlist',
        trackURIs: []
      })
    )
  }
  search(term){
    Spotify.search(term).then( searchResults=> {
      this.setState({searchResults: searchResults})
    })
  }
  render(){
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar
            onSearch={this.search} 
          />
          <div className='App-playlist'>
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
