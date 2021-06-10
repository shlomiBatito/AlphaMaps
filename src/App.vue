<template>
  <v-app>
    <div id="map"></div>
    <detailsCard v-if="this.locationClick" @closeDialog="locationClick = $event"
      :obj="this.selectedEvent"/>
  </v-app>
</template>
<script>
/* eslint-disable */
// import openlayer css for style
import "ol/ol.css";
// This is library of openlayer for handle map
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { transform } from "ol/proj";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import detailsCard from "./components/detailsCard";
import axios from "axios"
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style, Circle as CircleStyle, Fill, Stroke} from 'ol/style';
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';

export default {
  components: {
    detailsCard
  },
  data() {
    return {
      mouse: "",
      map: {},
      mapClick: false,
      dataSent: false,
      coords: [],
      events: [],
      selectedEvent: {},
      locationClick: false
    };
  },
  async mounted() {
    await this.initiateMap();
    await this.loadAllEvents();
  },
  methods: {
    loadAllEvents () {
      axios.get('http://police-server-securityapp2.apps.openforce.openforce.biz/map/allEvents')
  .then((response) => {
    this.events = response.data;
    // this.events = [[{ kidnapper:"John", kidnapped:30, last_location:"New York", date:"20/7/2021", report_date:"7/6/2021", reported_by:"Amit", lon:31, lat:34},
    // { kidnapper:"af", kidnapped:30, last_location:"New York", date:"20/7/2021", report_date:"7/6/2021", reported_by:"Amit", lon:9, lat:56},
    // { kidnapper:"Josafahn", kidnapped:30, last_location:"New York", date:"20/7/2021", report_date:"7/6/2021", reported_by:"Amit", lon:0, lat:9}]];

    this.features = [];
    var iconStyle = new Style({
          image: new CircleStyle({
          radius: 10,
          fill: new Fill({color: '#B22222'})
          })
        });

    for (let i = 0; i < this.events.length; i++) {
      for (let j = 0; j < this.events[i].length; j++) {
        var iconFeature = new Feature({
          geometry: new Point([this.events[i][j].lon, this.events[i][j].lat]),
        });

         this.events[i][j].date = this.formatDate(this.events[i][j].date);
        if(this.events[i][j].report_date) this.formatDate(this.events[i][j].report_date);

        iconFeature.setStyle(iconStyle);
        iconFeature.details = this.events[i][j];

        this.features.push(iconFeature);
      } 
    } 
        
      var vectorSource = new VectorSource({
          features: this.features,
          wrapX: false,
        });
      
      var markersLayer = new VectorLayer({
        source: vectorSource,
        map: this.map
      });
      }); 
    },
    formatDate(date) {
      date = new Date(date);
      return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    },
    isFeatureExist(evt) {
      const clickLocation = evt.coordinate;

      const chosenEvent = this.searchLocations(clickLocation);
      if(chosenEvent) {
        this.selectedEvent = chosenEvent;
        this.locationClick = true;
      }    
    },
    searchLocations(cordinateToCheck) {
      let isExists = null;
        this.events.forEach(eventsArr => {
        eventsArr.forEach(event => {
          if(this.searchNear(cordinateToCheck,[event.lon, event.lat], 10)) {
            isExists = event;
            return;
          }
        }) 
      })

      return isExists;
    },
    searchNear(cordinateToCheck, eventLocation, radius) {
      return Math.round(cordinateToCheck[0] ) ==  Math.round(eventLocation[0] )
          && Math.round(cordinateToCheck[1] ) == Math.round(eventLocation[1] )
    },
    initiateMap() {
      // create title layer
      var raster = new TileLayer({
        source: new OSM()
      });
      let MousePositionObj = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: "EPSG:4326",
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: "custom-mouse-position",
        target: this.mouse
      });
      // create map with 2 layer
      this.map = new Map({
        controls: defaultControls().extend([]),
        target: "map",
        layers: [raster],
        view: new View({
          projection: "EPSG:4326",
          center: [0, 0],
          zoom: 2
        }),
      });

      // hendles mouse click on the map
      this.map.on('singleclick', (evt, methods, data) => {
        this.coords = evt.coordinate;
        this.isFeatureExist(evt);
      })
    }
  }
};
</script>
<style>
#map {
  position: absolute;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>