import React, { Component } from 'react'
import { isBrowser } from '../util'
import styles from 'css/components/map.css'
import { MAP_TOOLTIP_ZOOM_LEVEL } from '../constants'

// conditionally import Leaflet -> requires `window`
let L
if (isBrowser) L = require('leaflet')

export default class Map extends Component {

  constructor() {

    super()

    this.onMapZoomEnd = this.onMapZoomEnd.bind(this)

  }

  componentDidMount() {

    this.initIcon()
    this.initMap()

  }

  componentDidUpdate() {

    const { markers } = this.props

    // clear pubs
    this.clearMarkers()

    // TODO - really should check if markers != prevProps.markers
    this.plotMarkers(markers, this.markerIcon)

  }

  initIcon() {

    this.markerIcon = L.divIcon({ className: styles.icon, iconSize: [ 40, 40 ] })

  }

  initMap() {

    const { markers, mapOptions, tileOptions, tileURL } = this.props

    // init Leaflet map
    this.map = L.map('map', mapOptions)

    // add map events
    this.map.on('zoomend', this.onMapZoomEnd)

    // configure Leaflet
    L.tileLayer(tileURL, tileOptions).addTo(this.map)

    // clear pubs
    this.clearMarkers()

    // plot pubs
    this.plotMarkers(markers, this.markerIcon)

  }

  plotMarkers(markers, icon) {

    this.markerLayer = L.layerGroup()
    this.tooltipLayer = L.layerGroup()

    markers.map( ({ coordinates: [ lng, lat ], name }) => {

      let tooltip = new L.tooltip({ direction: 'bottom', offset: [ 0, 20 ], permanent: true })
        .setLatLng([ lat, lng ])
        .setContent(name)

      this.tooltipLayer.addLayer(tooltip)

      return this.markerLayer.addLayer( L.marker([ lat, lng ], { icon }).bindPopup(name) )

    } )

    this.markerLayer.addTo(this.map)

  }

  clearMarkers() {

    this.markerLayer && this.markerLayer.clearLayers()

  }

  toggleTooltips() {

    const zoomLevel = this.map.getZoom()
    const tooltipLayer = this.tooltipLayer
    const isLayerOnMap = this.map.hasLayer(tooltipLayer)
    const isTooltipZoomLevel = zoomLevel >= MAP_TOOLTIP_ZOOM_LEVEL

    if (isTooltipZoomLevel && !isLayerOnMap) return tooltipLayer.addTo(this.map)
    else if (!isTooltipZoomLevel && isLayerOnMap) return tooltipLayer.removeFrom(this.map)

  }

  onMapZoomEnd() {

    this.toggleTooltips()

  }

  render() {

    return (
      <div id='map' className={styles.base}></div>
    )

  }

}
