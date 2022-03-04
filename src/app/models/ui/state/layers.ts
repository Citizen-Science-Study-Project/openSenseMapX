export const clusterLayer = {
  'id': 'boxes-cluster',
  'type': 'circle',
  'source': 'cluster-boxes',
  'filter':
    [
      'all',
      ['!=', null, ['get', 'Temperatur']],
      ['==', ['get', 'cluster'], true],
      ['has', 'point_count']
    ],
  'paint': {

    'circle-radius': {
      'property': 'point_count',
      'base': 1.75,
      'stops': [
        [{zoom: 1, value: 1}, 20],
        [{zoom: 1, value: 100}, 40],
        [{zoom: 22, value: 1}, 3580],
        [{zoom: 22, value: 100}, 6580],
      ]
    },
    'circle-color': [
      'interpolate',
      ['linear'],
      ['/', ['get', 'Temperatur'], ['get', 'point_count']],
      -5, '#9900cc',
      0, '#0000ff',
      10, '#0099ff',
      20, '#ffff00',
      30, '#ff0000'
    ],
    'circle-opacity': 0.7,
    'circle-stroke-color': '#4eaf47',
    'circle-stroke-width': 2
  }
};

export const clusterLayerSolo = {
  'id': 'boxes-no-cluster',
  'type': 'circle',
  'source': 'cluster-boxes',
  'filter':
    [
      'all',
      // ["!=", null, [ "get", "Temperatur", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
      ['!=', null, ['get', 'value', ['object', ['get', 'Temperatur', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
      ['!', ['has', 'point_count']]
    ]
  ,
  'paint': {
    'circle-radius': {
      'base': 1.75,
      'stops': [[1, 6], [22, 3000]]
    },
    'circle-color': [
      'interpolate',
      ['linear'],
      // [ "get", "Temperatur", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
      ['get', 'value', ['object', ['get', 'Temperatur', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
      -5, '#9900cc',
      0, '#0000ff',
      10, '#0099ff',
      20, '#ffff00',
      30, '#ff0000'
    ],
  }
};

