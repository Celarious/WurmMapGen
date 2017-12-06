'use strict';

WurmMapGen.map = {

	/**
	 * Initialises and creates the map interface
	 */
	create: function() {
		var config = WurmMapGen.config;
		var xy = WurmMapGen.util.xy;

		// Set up the map
		var map = WurmMapGen.map.map = L.map('map', {
			maxBounds: [xy(0,0), xy(config.actualMapSize,config.actualMapSize)],
			maxZoom: config.mapMaxZoom,
			minZoom: config.mapMinZoom,
			crs: L.CRS.Simple,
			zoomControl: false
		});

		new L.Control.Zoom({position: 'bottomright'}).addTo(map);

		var mapBounds = new L.LatLngBounds(
			map.unproject([0, config.maxMapSize], config.mapMaxZoom),
			map.unproject([config.maxMapSize, 0], config.mapMaxZoom));

		map.fitBounds(mapBounds);
        map.setZoom(Math.ceil((config.mapMinZoom + config.mapMaxZoom) / 2) - 1);

		var wurmMapLayer = L.tileLayer('images/{x}-{y}.png', {
			maxNativeZoom: config.nativeZoom,
			minNativeZoom: config.nativeZoom,
			minZoom: config.mapMinZoom,
			maxZoom: config.mapMaxZoom,
			bounds: mapBounds,
			attribution: 'Rendered with <a href="https://github.com/Garrett92/WurmMapGen">WurmMapGen</a>',
			noWrap: true,
			tms: false
		}).addTo(map);

		// Create layer groups
		var villageBorders = L.layerGroup();
		var villageMarkers = L.layerGroup();
		var guardtowerBorders = L.layerGroup();
		var guardtowerMarkers = L.layerGroup();
		var structureBorders = L.layerGroup();
		var playerMarkers = L.layerGroup();

		// Add villages
		for (var i = 0; i < WurmMapGen.villages.length; i++) {
			var village = WurmMapGen.villages[i];

			// Create polygon based on village border data
			var border = L.polygon([
				xy(village.borders[0], village.borders[1]),
				xy(village.borders[2], village.borders[1]),
				xy(village.borders[2], village.borders[3]),
				xy(village.borders[0], village.borders[3])
			], {
				color: (village.permanent ? 'orange' : 'white'),
				fillOpacity: 0,
				weight: 1
			});

			var marker = L.marker(xy(village.x, village.y),
				{icon: WurmMapGen.markers[village.permanent ? 'main' : 'letter_' + village.name.charAt(0)]}
			);

			marker.bindPopup('<div align="center"><b>' + village.name + '</b><br><i>' + village.motto + '</i></div><br><b>Mayor:</b> ' + village.mayor + '<br><b>Citizens:</b> ' + village.citizens + '');

			// Open the marker popup when the border is clicked
			border.on('click', function() { marker.openPopup(); });

			villageBorders.addLayer(border);
			villageMarkers.addLayer(marker);
		}

		// Add guard towers
		for (var i = 0; i < WurmMapGen.guardtowers.length; i++) {
			var tower = WurmMapGen.guardtowers[i];

			// Create polygon based on guard tower border data
			var border = L.polygon([
				xy(tower.borders[0], tower.borders[1]),
				xy(tower.borders[2], tower.borders[1]),
				xy(tower.borders[2], tower.borders[3]),
				xy(tower.borders[0], tower.borders[3])
			], {
				color: 'red',
				fillOpacity: 0.1,
				weight: 1
			});

			var marker = L.marker(xy(tower.x, tower.y),
				{icon: WurmMapGen.markers.guardtower}
			);

			marker.bindPopup('<div align="center"><b>Guard Tower</b><br><i>Created by ' + tower.creator + '</i></div><br><b>QL:</b> ' + tower.ql + '<br><b>DMG:</b> ' + tower.dmg + '');

			// Open the marker popup when the border is clicked
			border.on('click', function() { marker.openPopup(); });

			guardtowerBorders.addLayer(border);
			guardtowerMarkers.addLayer(marker);
		}

		// Add structures
		for (var i = 0; i < WurmMapGen.structures.length; i++) {
			var structure = WurmMapGen.structures[i];

			// Create polygon based on guard tower border data
			var border = L.polygon([
				xy(structure.borders[0], structure.borders[1]),
				xy(structure.borders[2], structure.borders[1]),
				xy(structure.borders[2], structure.borders[3]),
				xy(structure.borders[0], structure.borders[3])
			], {
				color: 'blue',
				fillOpacity: 0.1,
				weight: 1
			});

			border.bindPopup('<div align="center"><b>' + structure.getStructureName() + '</b><br><i>Created by ' + structure.getOwnerName() + '</i></div>');

			structureBorders.addLayer(border);
		}

		// Add layers to map
		villageBorders.addTo(map);
		villageMarkers.addTo(map);
		guardtowerBorders.addTo(map);
		guardtowerMarkers.addTo(map);
		structureBorders.addTo(map);
		playerMarkers.addTo(map);

        // Add overlay control
		var overlayData = {
			"Player Markers": playerMarkers,
			"Structure Borders": structureBorders,
			"Deed Borders": villageBorders,
			"Deed Markers": villageMarkers,
			"Guard Tower Markers": guardtowerMarkers,
			"Guard Tower Borders": guardtowerBorders
		};

		L.control.layers(null, overlayData).addTo(map);

		// Add coordinates display
		L.control.coordinates({
			position:"bottomleft",
			labelFormatterLng : function(e){
				if (e < 0) {
					e = ((180 + e) + 180);
				}
				return Math.floor(e * xyMulitiplier)+" x,"
				},
			labelFormatterLat : function(e){
				return Math.floor((-e)*xyMulitiplier)+" y"
				}
		}).addTo(map);
	}
};
