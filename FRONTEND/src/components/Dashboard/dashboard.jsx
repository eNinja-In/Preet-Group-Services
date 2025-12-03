import { Link, Route, Routes } from "react-router-dom";
import Btn from "../common/Btn";
import {GetLatLongFromGoogleMapLink, RouteMap} from "../Helper/locationToLL";

export default function Dashboard() {
  const googleMapUrl = "https://www.google.com/maps/place/Preet+Tractors+%26+Combine-+%E0%A8%AA%E0%A9%8D%E0%A8%B0%E0%A9%80%E0%A8%A4+%E0%A8%9F%E0%A8%B0%E0%A9%88%E0%A8%95%E0%A8%9F%E0%A8%B0+%E0%A8%A4%E0%A9%87+%E0%A8%95%E0%A9%B0%E0%A8%AC%E0%A8%BE%E0%A8%87%E0%A8%A8/@30.3855249,76.1755301,1962m/data=!3m1!1e3!4m9!1m2!2m1!1slongitude+and+latitude+finder!3m5!1s0x39103b595e27c45d:0x275bb4a9a584cc89!8m2!3d30.3892086!4d76.1784899!16s%2Fg%2F11r_qq4130?entry=ttu&g_ep=EgoyMDI1MTEzMC4wIKXMDSoASAFQAw%3D%3D";
  return (
    <div className="w-full min-h-screen bg-gray-50 p-1">

      <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-300">
        <Link to="" className="w-1/5"><Btn title="Dashboard" isActive={true} /></Link>
        <Link to="add-Data" className="w-1/5"><Btn title="New Complaints" /></Link>
        <Link to="combines-Data" className="w-1/5"><Btn title="Combine Data" /></Link>
      </div>

      <div className="w-full h-full">
        <Routes>
          <Route path="" element={<div><GetLatLongFromGoogleMapLink googleMapLink={googleMapUrl} /></ div>} />
          <Route path="add-Data" element={<div><Map/></div>} />
          <Route path="combines-Data" element={<div>Hello Combine Data</div>} />
        </Routes>
      </div>
    </div>
  );
}


// The routeData you provided
const routeData = {
  "features": [
    {
      "type": "Feature",
      "properties": {
        "mode": "drive",
        "waypoints": [
          {
            "location": [
              76.174906,
              30.385969
            ],
            "original_index": 0
          },
          {
            "location": [
              76.179067,
              30.383535
            ],
            "original_index": 1
          }
        ],
        "units": "metric",
        "avoid": [
          {
            "type": "locations",
            "values": [
              {
                "lat": 30.388595,
                "lon": 76.184933
              }
            ]
          }
        ],
        "details": [
          "instruction_details",
          "route_details"
        ],
        "distance": 932,
        "distance_units": "meters",
        "time": 71.223,
        "legs": [
          {
            "distance": 932,
            "time": 71.223,
            "steps": [
              {
                "speed": 70,
                "speed_limit": 70,
                "truck_limit": 70,
                "surface": "paved_smooth",
                "lane_count": 1,
                "road_class": "primary",
                "name": "State Highway 12A, SH12A, MDR32",
                "toll": false,
                "tunnel": false,
                "bridge": false,
                "roundabout": false,
                "rightside": false,
                "traversability": "both",
                "elevation": 253,
                "from_index": 0,
                "to_index": 6,
                "distance": 464,
                "time": 23.956,
                "instruction": {
                  "text": "Drive northeast on State Highway 12A/SH12A/MDR32.",
                  "type": "StartAt",
                  "transition_instruction": "Drive northeast. Then Turn right.",
                  "pre_transition_instruction": "Drive northeast on State Highway 12A, SH12A. Then Turn right.",
                  "post_transition_instruction": "Continue for 500 meters.",
                  "streets": [
                    "State Highway 12A",
                    "SH12A",
                    "MDR32"
                  ],
                  "contains_next_instruction": true
                }
              },
              {
                "speed": 40,
                "speed_limit": 70,
                "truck_limit": 70,
                "surface": "paved_smooth",
                "lane_count": 1,
                "road_class": "unclassified",
                "toll": false,
                "tunnel": false,
                "bridge": false,
                "roundabout": false,
                "rightside": false,
                "traversability": "both",
                "elevation": 252,
                "from_index": 6,
                "to_index": 10,
                "distance": 468,
                "time": 47.36821413276232,
                "instruction": {
                  "text": "Turn right.",
                  "type": "Right",
                  "transition_instruction": "Turn right.",
                  "post_transition_instruction": "Continue for 500 meters."
                }
              },
              {
                "from_index": 10,
                "to_index": 10,
                "distance": 0,
                "time": 0,
                "instruction": {
                  "text": "Your destination is on the right.",
                  "type": "DestinationReachedRight",
                  "transition_instruction": "Your destination will be on the right.",
                  "pre_transition_instruction": "Your destination is on the right."
                }
              }
            ],
            "country_code": [
              "cn"
            ]
          }
        ],
        "country_code": [
          "cn"
        ]
      },
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          [
            [
              76.174907,
              30.385969
            ],
            [
              76.174927,
              30.385998
            ],
            [
              76.175202,
              30.386373
            ],
            [
              76.175851,
              30.386943
            ],
            [
              76.176371,
              30.387381
            ],
            [
              76.177126,
              30.388017
            ],
            [
              76.178468,
              30.388736
            ],
            [
              76.178767,
              30.388359
            ],
            [
              76.179491,
              30.387682
            ],
            [
              76.180729,
              30.386506
            ],
            [
              76.181694,
              30.385586
            ]
          ]
        ]
      }
    }
  ],
  "properties": {
    "mode": "drive",
    "waypoints": [
      {
        "lat": 30.38596922557596,
        "lon": 76.17490651231748
      },
      {
        "lat": 30.38353534977776,
        "lon": 76.1790671605088
      }
    ],
    "units": "metric",
    "avoid": [
      {
        "type": "locations",
        "values": [
          {
            "lat": 30.388595,
            "lon": 76.184933
          }
        ]
      }
    ],
    "details": [
      "instruction_details",
      "route_details"
    ]
  },
  "type": "FeatureCollection"
};

function Map() {
  return (
    <div>
      <h1>Route Map</h1>
      <RouteMap routeData={routeData} />
    </div>
  );
}
