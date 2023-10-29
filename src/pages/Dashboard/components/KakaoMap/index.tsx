import React, { useEffect, useRef, useState } from 'react';
import SummaryEventStatus from '../SummaryEventStatus';
import SummarySystemStatus from '../SummarySystemStatus';
import { IPositions, IMapProps } from '@/interfaces/interfaceDashboard';
import { Group, createStyles } from '@mantine/core';
import ProgressBar from '../ProgressBar';

const svgString =
  '<svg width="80px" height="80px" viewBox="0 0 36.00 36.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#d12323"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.43200000000000005"/><g id="SVGRepo_iconCarrier"><title>map-marker</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" stroke-width="3.6" fill="none" fill-rule="evenodd"> <g id="Vivid-Icons" transform="translate(-125.000000, -643.000000)"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="map-marker" transform="translate(78.000000, 468.000000)"> <g transform="translate(10.000000, 6.000000)"> <path d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z" id="Shape" fill="#FF6E6E"> </path> <circle id="Oval" fill="#0C0058" fill-rule="nonzero" cx="14" cy="14" r="7"> </circle> </g> </g> </g> </g> </g> </g></svg>';
const imgSrc = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

function makeOverListener(
  map: kakao.maps.Map,
  marker: kakao.maps.Marker,
  infowindow: kakao.maps.InfoWindow,
) {
  return function () {
    infowindow.open(map, marker);
  };
}

function makeOutListener(infowindow: kakao.maps.InfoWindow) {
  return function () {
    infowindow.close();
  };
}

const useStyles = createStyles((theme) => ({
  mainLayout: {
    position: 'relative',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '16px',
    flex: '1 0 0',
  },

  map: {
    height: '448px',
    borderRadius: theme.radius['2xl'],
  },

  chartLayout: {
    height: '50%',
    display: 'flex',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: '0 0 auto',
    flexWrap: 'wrap',
    gap: '16px 16px',
    padding: '16px 0px',
    position: 'relative',
    width: '100%',
  },
}));

function Map({ data }: IMapProps) {
  const { classes, cx } = useStyles();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState('');
  const [isDivVisible, setDivVisible] = useState(false);
  const handleToggle = () => {
    setDivVisible(true);
  };
  const closeProgressBar = () => {
    setSelected('');
    setDivVisible(false);
  };
  let Cx = 0;
  let Cy = 0;
  useEffect(() => {
    const loadKakaoMap = () => {
      const script = document.createElement('script');
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=' +
        import.meta.env.VITE_KAKAO_MAP_API_KEY +
        '&libraries=services&autoload=false';
      script.addEventListener('load', () => {
        if (mapRef.current) {
          const container = mapRef.current;
          kakao.maps.load(() => {
            const positions: IPositions[] = data.map((item) => {
              const position: IPositions = {
                id: item.id,
                content: `<div>${item.rsuID}</div>`,
                latlng: new kakao.maps.LatLng(Number(item.latitude), Number(item.longitude)),
              };
              Cx += Number(item.latitude);
              Cy += Number(item.longitude);
              return position;
            });
            const mapOption = {
              center: new kakao.maps.LatLng(Cx / positions.length, Cy / positions.length),
              level: 5,
            };
            const map = new kakao.maps.Map(container, mapOption);
            let selectedMarker = new kakao.maps.Marker({
              map: map,
              position: new kakao.maps.LatLng(0, 0),
            });
            const tempMarker = selectedMarker;
            selectedMarker.setVisible(false);
            positions.map((position) => {
              const imgSize = new kakao.maps.Size(30, 30);
              const markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize);
              const clickedMarkerImage = new kakao.maps.MarkerImage(
                'data:image/svg+xml;base64,' +
                  btoa(unescape(encodeURIComponent(svgString.replace('#FF6E6E', '#70a0ff')))),
                new kakao.maps.Size(30, 30),
              );
              const marker = new kakao.maps.Marker({
                map: map,
                position: position.latlng,
                image: markerImage,
              });
              const infowindow = new kakao.maps.InfoWindow({
                position: position.latlng,
                content: `<div style='
                height: auto;
                width: auto;
                color: black;
                font-size: 18px;
                font-weight: 500;
                font-family: monospace;
                line-height: 20px;'>${position.content}</div>`,
              });
              kakao.maps.event.addListener(
                marker,
                'mouseover',
                makeOverListener(map, marker, infowindow),
              );

              kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

              kakao.maps.event.addListener(marker, 'click', () => {
                if (selectedMarker == marker) {
                  marker.setImage(markerImage);
                  setSelected('');
                  selectedMarker = tempMarker;
                  closeProgressBar();
                } else if (!selectedMarker || selectedMarker !== marker) {
                  !!selectedMarker && selectedMarker.setImage(markerImage);
                  marker.setImage(clickedMarkerImage);
                  selectedMarker = marker;
                  selectedMarker.setVisible(true);
                  setSelected(position.id);
                  handleToggle();
                }
              });
            });
          });
        }
      });
      document.head.appendChild(script);
    };
    loadKakaoMap();
  }, []);
  return (
    <div className={cx(classes.mainLayout)}>
      <div className={cx(classes.map)} ref={mapRef}></div>
      {isDivVisible && <ProgressBar id={selected} />}
      <Group className={cx(classes.chartLayout)}>
        <SummarySystemStatus />
        <SummaryEventStatus />
      </Group>
    </div>
  );
}

export default Map;
