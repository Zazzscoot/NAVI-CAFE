import { useEffect, useState, useRef } from 'react';
import './App.css';
import {useJsApiLoader, GoogleMap, DirectionsRenderer, Autocomplete} from '@react-google-maps/api';
import {LeftDrawer} from './components/leftDrawer.js';

function App() {
  const google = window.google;
  //For the directions
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const originRef= useRef()
  const destinationRef= useRef()

  const getDirections = async () => {
    if(!originRef.current.value || !destinationRef.current.value) return;

    const directionsService = new google.maps.DirectionsService()
    // console.log(origin.current)
    // console.log(destination.current)
    console.log(originRef)
    console.log(destinationRef)
    const directionsRequest = {
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: 'TRANSIT'
    }
    const results = await directionsService.route(directionsRequest)
    results ? console.log(results) : console.log("Didn't get results")
    setDirectionsResponse(results)
    directionsMode = true
  }


  //For the pitstops
  const [pitstops, setPitstops] = useState(null)

  const getPitstops = (directionsResponse) => {
    const validPitstops = []
    const steps = directionsResponse.routes[0].legs[0].steps

    for(let j = 0; j < steps.length; j++){
      if(steps[j].travel_mode === "TRANSIT") validPitstops.push(steps[j]);
    }

    const formattedPitstops = []
    for(let i = 0; i < (validPitstops.length); i++){
      const pitstop = {
        start_time: validPitstops[i].transit.arrival_time,
        end_time: i < validPitstops.length - 1 ? validPitstops[i+1].transit.departure_time : "---",
        location: validPitstops[i].transit.arrival_stop.location,
        name: validPitstops[i].transit.arrival_stop.name
      }
      formattedPitstops.push(pitstop)
    }
    console.log(formattedPitstops);
    setPitstops(formattedPitstops)
  }

  useEffect( () => {
    if(!directionsResponse) return;
    getPitstops(directionsResponse)
  }, [directionsResponse])

  //for the markers
  const [markers, setMarkers] = useState(null)
  const passMarkers = (markerFromDrawer) => {setMarkers(markerFromDrawer)}
  //do <LeftDrawer passMarkers = {passMarkers}/>
  //in the child: props.passMarkers(markerData)

  //for the cafe directions
  let directionsMode = true
  const [cafeDirections, setCafeDirections] = useState(null)
  const zoomToPitstop = (pitstopLocation) => {
    console.log("received from child")
    setMapCenter(pitstopLocation)
  }
  //for the map
  const [mapCenter, setMapCenter] = useState({ lat: 43.6607388, lng: -79.3988062 })
  const [map, setMap] = useState()
  const {isLoaded} = useJsApiLoader({
      googleMapsApiKey: "AIzaSyCWdGX9E1WSKsgT_YEu-eUD3DqWjhanbac",
      libraries: ['places'],
    })
  if(!isLoaded) return <div>Not loaded!</div>
  
  const clear = () =>{
    return null
  }
  
  
  
  return (
    <div >
      {pitstops && <LeftDrawer pitStops={pitstops} zoomToPitstop={zoomToPitstop}/>}
      
      <GoogleMap
        center={mapCenter}
        zoom={15}
        mapContainerStyle={{width: '100vw', height: '100vh'}}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        {directionsMode && directionsResponse && (
          <DirectionsRenderer directions={directionsResponse}/>
        )}
        {!directionsMode && cafeDirections && (
          <DirectionsRenderer directions={cafeDirections}/>
        )}
      </GoogleMap>
      
      <div className='inputContainer'>
        <div className='textInput'>
          <Autocomplete className='textInput'>
            <input className='innerInput' type='text' placeholder={"Origin"} ref={originRef}></input>
          </Autocomplete>
        </div>
        <div className='textInput'>
          <Autocomplete className='textInput'>
            <input className='innerInput' type='text' placeholder={"Destination"} ref={destinationRef}></input>
          </Autocomplete>
        </div>
          <button id='submitButton' onClick={getDirections}>Find My Commute</button>
          <button id='x' onClick={clear}>X</button>
      </div>
      
    </div>

    
    
  )};


export default App;
