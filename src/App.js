import * as React from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from "@mui/icons-material"
import "./App.css";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";



function App() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 2
  });
  const myStorage = window.localStorage;
  const [title, setTitle] = React.useState();
  const [desc, setDesc] = React.useState();
  const [rating, setStar] = React.useState();
  const [currentpalace, setCurrentPalaceId] = React.useState();
  const [newPlace, setNewPlace] = React.useState(null);
  const [pinss, setPins] = React.useState();
  const [currentUser, setCurrentUsername] = React.useState(myStorage.getItem("user"));
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

React.useEffect(() => {
  const getPins = async() => {
    try{
      const res = await axios.get("https://mappersreact.herokuapp.com/api/pins");
      setPins(res.data);
      console.log(res.data)
      }
      catch(err){
        console.log(err)
      }
      }
      getPins();
  }
, []);


const handleMarker = (id, lat, long) => {
setCurrentPalaceId(id);
setViewState({...viewState, latitude:lat, longitude:long})
}

const handleAddClick = (e) => {
  console.log(e.lngLat.lng)
  const lng = e.lngLat.lng
  const lat = e.lngLat.lat
  setNewPlace({
    lat: lat,
    long: lng,
  })
}


const handleSubmit = async(e) => {
e.preventDefault();
const newPin = {
  username:currentUser,
  title:title,
  description:desc,
  rating:rating,
  lat:newPlace.lat,
  long:newPlace.long,
}
try{
const res = await axios.post('https://mappersreact.herokuapp.com/api/pins', newPin);
setPins([...pinss, res.data]);
setNewPlace(null)
}
catch(er){
console.log(er)
}
}

const handleLogout = () => {
  setCurrentUsername(null);
  myStorage.removeItem("user");
};


  return(
  <Map
    {...viewState}
    onMove={evt => setViewState(evt.viewState)}
    mapboxAccessToken= "pk.eyJ1IjoidHVzaGFybmFnYXIiLCJhIjoiY2w4aHdlZmM4MGw5aTN3bXI1Z3JiZ3QyZSJ9.VJmiBz5AwXOBc-fbfakiUw"
    mapStyle="mapbox://styles/mapbox/streets-v9"
    style={{width: "100vw", height: "100vh"}}
    transitionDuration="200"
    onDblClick = {handleAddClick}
  >
    {pinss?.map((item, index)=>(
      <div key={index}>
      <Marker longitude={item.long} latitude={item.lat} anchor="bottom">
        <Room style={{color:item.username === currentUser ? "tomato": "slateblue"}}  onClick={() => handleMarker(item._id, item.lat, item.long)}/>
    </Marker>
        
    {item._id === currentpalace && (
      <Popup
      key={index}
      latitude={item.lat}
      longitude={item.long}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setCurrentPalaceId(null)}
      anchor="left"
    >
      <div className="card">
        <label>Place</label>
        <h4 className="place">{item.title}</h4>
        <label>Review</label>
        <p className="desc">{item.desc}</p>
        <label>Rating</label>
        <div className="stars">
        {Array(item.rating).fill(<Star className="star"/>)}
        </div>
        <label>Information</label>
        <span className="username">
          Created by <b>{item.username}</b>
        </span>
        <span className="date">{(item.createdAt)}</span>
      </div>
    </Popup>
    )}
    </div>
    
    ))}

{newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
            >
              <Room
                style={{
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
{currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
  </Map>
  )
}


export default App;