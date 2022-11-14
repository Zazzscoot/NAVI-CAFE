import React, {useEffect, useState} from 'react'
import './leftDrawer.css';
import {BsBoxArrowLeft} from 'react-icons/bs'

export const LeftDrawer = (props) => {
    const pitStops = props.pitStops
    
    const [display, setDisplay] = useState('pitstops')
    const [pitstopDisplays, setPitstopDisplays] = useState([])

    const setPitStops = (pitStops) => {
        for(let x = 0; x < pitStops.length; x++){
            const name = pitStops[x].name
            const start_time = pitStops[x].start_time.text
            const end_time = pitStops[x].end_time.text
            // pitstopDisplayContainer.push(<PitstopDisplay name={name} start_time={start_time} stop_time={stop_time} stop_number={x+1}/>)     
            setPitstopDisplays((prev) => [...prev, <PitstopDisplay name={name} start_time={start_time} end_time={end_time} stop_number={x} handleClick={handleClick}/>])
        }
        setDisplay('pitstops')
    }
    
    useEffect( () => {
        setPitstopDisplays([])
        setPitStops(pitStops)
    }, [])

    //the arrow
    const [open, setOpen] = useState(true)
    const handleArrow = (e) =>{
        if(open){
            e.target.style.transform = 'rotate(180deg)'
            document.getElementById("content").style.display = 'none'
            setOpen(false)
        }else{
            e.target.style.transform = 'rotate(0deg)'
            document.getElementById("content").style.display = 'block'            
            setOpen(true)
        }
        console.log("Arrow clicked!")
    }

    //the button
    const [currentPitStop, setCurrentPitStop] = useState(null)
    const handleClick = (e) => {
        setPlaces([])
        const pitstop = pitStops[e.target.value]
        setCurrentPitStop(pitstop)
        fetch('/getLocations',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                lat: pitstop.location.lat(),
                lng: pitstop.location.lng(),
                query: "coffee shop",
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                })
            })
            .then(res => res.json())
            .then((data) => {
                const cafes = handleData(data)
                setCafes(cafes, pitstop.location)
        })
    }
    
    const [cafesDisplay, setCafesDisplay] = useState([])
    const setCafes = (cafes, pitstopLocation) => {
        setDisplay('cafes')
        for(let i = 0; i < cafes.length; i++){
            setCafesDisplay((prev) => [...prev, <CoffeeShopDisplay info={cafes[i]} pistopLocation={pitstopLocation} pitstopToCafe={pitstopToCafe} num={i}/>])
        }
    }
    const pitstopToCafe = (e) => {
        console.log(e.target.value)
        console.log(places)
        //props.zoomToPitstop(places[e.target.value].location)
        
    }

    const [places, setPlaces] = useState([])
    const handleData = (data) => {
        const allPlaces = []
        data.map((place) => {
            const name = place.name
            let photo = null
            // place.photos === null || place.photos.length === 0 ?  photo = null : photo = place.photos[0];
            if(place.photos){
                photo = place.photos[0]
            }
            const rating = place.rating
            const location = place.geometry.location
            const icon = place.icon
            const placeObj = {
                name: name,
                photo: photo,
                rating: rating,
                location: location,
                icon: icon,
            }
            allPlaces.push(placeObj)
        })
        setPlaces(allPlaces)
        console.log(allPlaces)
        return allPlaces
    }


    //render
    return (
    <div id="leftDrawer">
        {display === 'pitstops' ? <ul id="content">{pitstopDisplays.map( (pitstop) => {
                return (pitstop)})}    
        </ul>: null}
        {display === 'cafes' ? 
        <ul id="cafeContent">
            <li id="coffeeShopTitle">Coffee Shops near {currentPitStop.name}...</li>
            {cafesDisplay.map( (cafe) => {
            return (cafe)})}
        </ul> : null}
        <BsBoxArrowLeft id='arrow' onClick={handleArrow}/>
    </div>
    )
}

const PitstopDisplay = (props) => {
    const name = props.name
    const start_time = props.start_time
    const end_time = props.end_time
    const handleClick = props.handleClick
    const stop_number = props.stop_number
    return (
        <li className='pitstopDisplay'>
            <h3 className='pitstopName'>{name}</h3>
            {end_time ? <h4 className='pitstopDescription'>We are here from {start_time} to {end_time}.</h4>: <h4 className='pitstopDescription'>We are here from {start_time}.</h4> }
            <button className="stopButton" value={stop_number} onClick={handleClick}>Stop by here!</button>
        </li>
    )
}

const CoffeeShopDisplay = ({info, num, pitstopToCafe}) => {
    const name = info.name
    const photos = info.photo
    const rating = info.rating
    const url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photos.photo_reference + '&key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    return (
        <li className='coffeeShopDisplay'>
            <h3 className='cafeName'>{name}</h3>
            {rating ? <b className='rating'>Rating: {rating}</b> : <b className='rating'>No rating</b>}
            {photos && <img src={url} className="cafeImage"></img>}
            <button className='stopButton' value={num} onClick={pitstopToCafe}>Go here!</button>
        </li>
    )
}