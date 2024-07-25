   {/* // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    let mapToken = mapToken;
    console.log(mapToken); */}
    mapboxgl.accessToken = mapToken ;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9, // starting zoom
    });

    console.log(coordinates);

    const marker = new mapboxgl.Marker({ color:"red"})
    .setLngLat(coordinates) // Listing.geometry.coordinates 
    .setPopup(
        new mapboxgl.Popup({offset: 25 })
    .setHTML(
        "<h3>Welcome to WanderGO!</h3>"
      )
    )
    .addTo(map);