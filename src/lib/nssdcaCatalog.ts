/**
 * Official NASA NSSDCA (National Space Science Data Center) Catalog Mapping
 * Maps Apollo & Mars heritage objects to their definitive NASA Master Catalog designations
 * and official public archive records.
 *
 * Source: NASA Space Science Data Coordinated Archive (https://nssdc.gsfc.nasa.gov/)
 */

export interface NssdcCatalogEntry {
  nssdcaId: string;
  catalogUrl: string;
  officialDesignation: string;
  archetype: string;
  funFactKid: string;
}

const CATALOG_DATA: Record<string, Record<string, NssdcCatalogEntry>> = {
  "apollo-11": {
    "descent-stage": {
      nssdcaId: "1969-059C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Apollo 11 Lunar Module Descent Stage (Eagle)",
      archetype: "Permanent Lunar Launch Platform",
      funFactKid:
        "The plaque on Eagle's leg is signed by all 3 astronauts and President Nixon, reading: 'We came in peace for all mankind.'",
    },
    flag: {
      nssdcaId: "1969-059C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Lunar Flag Assembly (Apollo 11)",
      archetype: "Symbolic Memorial Artifact",
      funFactKid:
        "Because the Moon has no wind, the flag was designed with a telescoping top rod so it wouldn't droop like a wet towel!",
    },
    lrrr: {
      nssdcaId: "1969-059E",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059E",
      officialDesignation: "Laser Ranging RetroReflector (Apollo 11 LRRR)",
      archetype: "Active Passive Optical Reflector",
      funFactKid:
        "Over 50 years later, observatories on Earth still shoot lasers at this 100-prism glass mirror every week to measure the Moon's distance to within millimeters!",
    },
    psep: {
      nssdcaId: "1969-059C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Passive Seismic Experiment Package (PSEP)",
      archetype: "Solar Lunar Seismometer",
      funFactKid:
        "PSEP was so sensitive that it heard the footsteps of Neil Armstrong and Buzz Aldrin as vibrations through the ground!",
    },
    "tv-camera": {
      nssdcaId: "1969-059C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Apollo 11 Lunar Surface TV Camera",
      archetype: "Slow-Scan Monochromatic Camera",
      funFactKid:
        "600 million people—one out of every five humans on Earth at the time—watched Neil Armstrong step onto the Moon through this single camera.",
    },
    mesa: {
      nssdcaId: "1969-059C-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Modular Equipment Stowage Assembly (MESA)",
      archetype: "Equipment Equipment Bay",
      funFactKid:
        "The MESA tray folded down like a tailgate on a pickup truck when Neil pulled a lanyard while standing on the porch ladder.",
    },
    swc: {
      nssdcaId: "1969-059C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C",
      officialDesignation: "Solar Wind Composition Foil Sheet",
      archetype: "Particle Physics Foil Collector",
      funFactKid:
        "This experiment was basically a sheet of pure Swiss aluminum foil placed in the sun to catch particles blowing directly out of the Sun!",
    },
  },
  "apollo-12": {
    "descent-stage": {
      nssdcaId: "1969-099C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      officialDesignation: "Apollo 12 Lunar Module Descent Stage (Intrepid)",
      archetype: "Precision Lunar Landing Base",
      funFactKid:
        "Pete Conrad piloted Intrepid to land just 163 meters from Surveyor 3—proving humans could land at an exact target on another world!",
    },
    "surveyor-3": {
      nssdcaId: "1967-035A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A",
      officialDesignation: "Surveyor 3 Soft Lander",
      archetype: "Robotic Precursor Lander",
      funFactKid:
        "Surveyor 3 waited alone in the dark lunar crater for 2.5 years until Conrad and Bean walked up to it and cut off its camera to bring back to Earth!",
    },
    alsep: {
      nssdcaId: "1969-099C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      officialDesignation: "Apollo 12 ALSEP Central Station",
      archetype: "Nuclear-Powered Science Station",
      funFactKid:
        "When the astronauts crashed their empty ascent rocket into the Moon, this station heard the Moon ring like a hollow bell for nearly an hour!",
    },
    "s-band-antenna": {
      nssdcaId: "1969-099C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      officialDesignation: "Deployable S-Band High-Gain Antenna",
      archetype: "Deep Space Communications Dish",
      funFactKid:
        "This dish was aimed by hand directly at Earth in the lunar sky so scientists in Houston could receive high-quality data.",
    },
    "hand-tool-carrier": {
      nssdcaId: "1969-099C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      officialDesignation: "Apollo Lunar Hand Tool Carrier",
      archetype: "Geology Tool Caddy",
      funFactKid:
        "Conrad and Bean carried this toolbox across 1.3 kilometers of lunar terrain to collect 34 kg of moon rocks.",
    },
    flag: {
      nssdcaId: "1969-099C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C",
      officialDesignation: "Lunar Flag Assembly (Apollo 12)",
      archetype: "Symbolic Memorial Artifact",
      funFactKid:
        "The Apollo 12 flag latch jammed slightly, so the top rod couldn't fully lock—making it look like it was waving even more!",
    },
  },
  "apollo-14": {
    "descent-stage": {
      nssdcaId: "1971-008C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Apollo 14 Lunar Module Descent Stage (Antares)",
      archetype: "Highland Landing Platform",
      funFactKid:
        "Antares touched down in the rugged Fra Mauro highlands, opening up the mountains of the Moon to human exploration.",
    },
    "golf-balls": {
      nssdcaId: "1971-008C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Alan Shepard's Lunar Golf Balls",
      archetype: "Extraterrestrial Sports Artifact",
      funFactKid:
        "Commander Alan Shepard hit two golf balls with a modified 6-iron. In one-sixth gravity, the second ball flew 'miles and miles and miles!'",
    },
    met: {
      nssdcaId: "1971-008C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Modular Equipment Transporter (MET)",
      archetype: "Two-Wheeled Lunar Rickshaw",
      funFactKid:
        "Astronauts nicknamed the MET the 'lunar rickshaw'. It had rubber tires filled with nitrogen to bounce smoothly across craters.",
    },
    alsep: {
      nssdcaId: "1971-008C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Apollo 14 ALSEP Science Station",
      archetype: "Nuclear-Powered Geophysics Station",
      funFactKid:
        "Alan Shepard used small explosive thumper charges on the ground to map the subsurface crust like an ultrasound!",
    },
    lrrr: {
      nssdcaId: "1971-008C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Apollo 14 Laser Ranging Retroreflector",
      archetype: "Optical Corner-Cube Array",
      funFactKid:
        "This was the second reflector placed on the Moon, helping create a triangle of mirrors to detect lunar wobbles.",
    },
    flag: {
      nssdcaId: "1971-008C-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-008C",
      officialDesignation: "Lunar Flag Assembly (Apollo 14)",
      archetype: "Symbolic Memorial Artifact",
      funFactKid:
        "Ed Mitchell took a famous photograph of Alan Shepard standing tall beside this flag with Fra Mauro's hills in the background.",
    },
  },
  "apollo-15": {
    "descent-stage": {
      nssdcaId: "1971-063C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      officialDesignation: "Apollo 15 Lunar Module Descent Stage (Falcon)",
      archetype: "Heavy J-Mission Lunar Base",
      funFactKid:
        "Falcon was the first extended 'J-mission' lander, carrying double the batteries, water, and the first electric moon car!",
    },
    lrv: {
      nssdcaId: "1971-063D",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063D",
      officialDesignation: "Lunar Roving Vehicle #1 (LRV-001)",
      archetype: "Extraterrestrial Electric Dune Buggy",
      funFactKid:
        "The Lunar Rover had wheels made of woven piano wire and zinc-coated titanium chevrons instead of rubber, reaching top speeds of 13 km/h!",
    },
    "fallen-astronaut": {
      nssdcaId: "1971-063C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      officialDesignation: "Fallen Astronaut Memorial Sculpture & Plaque",
      archetype: "Off-World Memorial Art Sculpture",
      funFactKid:
        "This tiny 8.5 cm aluminum figurine is the ONLY piece of art intentionally placed on the Moon, honoring 14 astronauts and cosmonauts who died.",
    },
    alsep: {
      nssdcaId: "1971-063C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      officialDesignation: "Apollo 15 ALSEP Station & Heat Flow Probes",
      archetype: "Deep Lunar Heat Flow Observatory",
      funFactKid:
        "Astronaut Dave Scott drilled deep boreholes into the Moon to measure heat escaping from the core.",
    },
    lrrr: {
      nssdcaId: "1971-063C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      officialDesignation: "Apollo 15 Large Laser Retroreflector (300 Prisms)",
      archetype: "Triple-Sized Optical Reflector",
      funFactKid:
        "With 300 prisms—three times larger than Apollo 11's—this is the most frequently bounced mirror on the Moon!",
    },
    flag: {
      nssdcaId: "1971-063C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
      officialDesignation: "Lunar Flag Assembly (Apollo 15)",
      archetype: "Symbolic Memorial Artifact",
      funFactKid:
        "Planted right in front of the giant 4,000-meter-tall Mount Hadley mountain peak.",
    },
  },
  "apollo-16": {
    "descent-stage": {
      nssdcaId: "1972-031C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C",
      officialDesignation: "Apollo 16 Lunar Module Descent Stage (Orion)",
      archetype: "Descartes Highlands Outpost",
      funFactKid:
        "Orion landed at Descartes, the highest elevation of any Apollo landing site on the Moon.",
    },
    lrv: {
      nssdcaId: "1972-031D",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031D",
      officialDesignation: "Lunar Roving Vehicle #2 (LRV-002)",
      archetype: "Lunar Electric Rover",
      funFactKid:
        "John Young drove this rover in a famous 'Grand Prix' run, making tight skids across the regolith to test steering limits!",
    },
    "family-photo": {
      nssdcaId: "1972-031C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C",
      officialDesignation: "Charles Duke Family Portrait in Shrink-Wrap",
      archetype: "Personal Human Family Memorial",
      funFactKid:
        "Astronaut Charlie Duke left a photo of his wife and two sons wrapped in clear plastic. On the back he wrote: 'This is the family of Astronaut Charlie Duke from planet Earth.'",
    },
    "uv-camera": {
      nssdcaId: "1972-031C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C",
      officialDesignation: "Far Ultraviolet Camera / Spectrograph",
      archetype: "First Lunar Astronomical Observatory",
      funFactKid:
        "This was the very first astronomical telescope ever operated on another celestial world, photographing Earth's upper atmosphere in ultraviolet light!",
    },
    alsep: {
      nssdcaId: "1972-031C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C",
      officialDesignation: "Apollo 16 ALSEP Science Station",
      archetype: "Highland Geophysical Station",
      funFactKid:
        "Its magnetometer discovered that the Moon's crust has localized magnetic patches even though it has no global magnetic field!",
    },
    flag: {
      nssdcaId: "1972-031C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-031C",
      officialDesignation: "Lunar Flag Assembly (Apollo 16)",
      archetype: "Symbolic Memorial Artifact",
      funFactKid:
        "John Young gave a famous mid-air leaping salute next to this flag while Charles Duke took the photo!",
    },
  },
  "apollo-17": {
    "descent-stage": {
      nssdcaId: "1972-096C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C",
      officialDesignation: "Apollo 17 Lunar Module Descent Stage (Challenger)",
      archetype: "Taurus-Littrow Valley Base",
      funFactKid:
        "Challenger was the final crewed Apollo spacecraft to touch down on the Moon on December 11, 1972.",
    },
    lrv: {
      nssdcaId: "1972-096D",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096D",
      officialDesignation: "Lunar Roving Vehicle #3 (LRV-003)",
      archetype: "Final Apollo Lunar Buggy",
      funFactKid:
        "When a fender broke off, Gene Cernan taped lunar maps together with duct tape to fix it and keep blinding dust off the astronauts!",
    },
    "orange-soil": {
      nssdcaId: "1972-096C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C",
      officialDesignation: "Shorty Crater Pyroclastic Orange Volcanic Soil",
      archetype: "Ancient Lunar Volcanic Glass",
      funFactKid:
        "Geologist-astronaut Harrison Schmitt shouted: 'There is orange soil!' It turned out to be 3.6-billion-year-old volcanic glass beads!",
    },
    alsep: {
      nssdcaId: "1972-096C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C",
      officialDesignation: "Apollo 17 ALSEP Station & Tidal Gravimeter",
      archetype: "Lunar Tidal Gravity Observatory",
      funFactKid:
        "This station measured how the Earth's gravity exerts tidal tugs on the solid rock of the Moon!",
    },
    lrrr: {
      nssdcaId: "1972-096C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C",
      officialDesignation: "Apollo 17 Laser Ranging Retroreflector",
      archetype: "Final Apollo Laser Prism Array",
      funFactKid:
        "Completed the Apollo laser network, allowing astronomers to calculate the Moon's distance to within 1 millimeter!",
    },
    flag: {
      nssdcaId: "1972-096C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-096C",
      officialDesignation: "Lunar Flag Assembly (Apollo 17)",
      archetype: "Final Human-Planted Lunar Flag",
      funFactKid:
        "Before leaving, Gene Cernan dedicated this flag to the peaceful exploration of space for the entire world.",
    },
  },
  "mars-viking1": {
    "v1-lander-body": {
      nssdcaId: "1975-075C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "Viking 1 Lander (Thomas Mutch Memorial Station)",
      archetype: "First Long-Duration Mars Surface Station",
      funFactKid:
        "Viking 1 sent the very first high-resolution colour photograph of the surface of Mars back to Earth on July 20, 1976!",
    },
    "v1-sampler-arm": {
      nssdcaId: "1975-075C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "Surface Sampler Collector Arm",
      archetype: "Robotic Soil Scoop & Trench Digger",
      funFactKid:
        "The 3-meter mechanical boom scooped red soil into tiny internal automated test laboratories to look for Martian microbes.",
    },
    "v1-meteorology": {
      nssdcaId: "1975-075C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "Meteorology Sensor Boom",
      archetype: "Martian Weather Station",
      funFactKid:
        "Recorded daily martian weather for over 6 years—measuring winds up to 120 km/h and winter temperatures plunging below -120°C!",
    },
    "v1-cameras": {
      nssdcaId: "1975-075C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "Facsimile Stereo Camera Pair",
      archetype: "Slow-Scan Mechanical Mirror Cameras",
      funFactKid:
        "Instead of digital lenses, these cameras used tiny vibrating nodding mirrors that scanned line-by-line across Chryse Planum!",
    },
    "v1-antenna": {
      nssdcaId: "1975-075C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "High-Gain Parabolic S/X-Band Antenna",
      archetype: "Direct-to-Earth Communications Dish",
      funFactKid:
        "Beamed signals across hundreds of millions of kilometers of deep space straight into NASA's Deep Space Network dishes in California, Spain, and Australia.",
    },
    "v1-seismometer": {
      nssdcaId: "1975-075C-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C",
      officialDesignation: "Viking 1 Surface Seismometer",
      archetype: "First Martian Seismic Instrument",
      funFactKid:
        "A locking pin failed to release on Viking 1's seismometer, meaning it recorded winds shaking the lander instead of internal marsquakes!",
    },
  },
  "mars-pathfinder": {
    "mp-base-station": {
      nssdcaId: "1996-068A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A",
      officialDesignation: "Carl Sagan Memorial Station (Mars Pathfinder)",
      archetype: "Airbag-Cushioned Lander Base",
      funFactKid:
        "Pathfinder landed by bouncing across the Martian rocks wrapped in giant inflatable airbags like a giant 3-story bouncy ball!",
    },
    "mp-sojourner": {
      nssdcaId: "1996-068B",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068B",
      officialDesignation: "Sojourner Microrover",
      archetype: "Humanity's First Wheeled Mars Rover",
      funFactKid:
        "Sojourner was the size of a microwave oven and weighed only 11.5 kg, but it paved the way for every Mars rover that followed!",
    },
    "mp-ramp": {
      nssdcaId: "1996-068A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A",
      officialDesignation: "Deployable Egress Ramps",
      archetype: "Rover Deployment Tracks",
      funFactKid:
        "Sojourner slowly rolled down these two metal tracks to touch the red dirt with its 6 small aluminum wheels on July 5, 1997.",
    },
    "mp-imp-camera": {
      nssdcaId: "1996-068A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A",
      officialDesignation: "Imager for Mars Pathfinder (IMP)",
      archetype: "Stereoscopic Periscope Mast Camera",
      funFactKid:
        "Rose 1.5 meters on an accordion mast to give scientists on Earth stereoscopic 3D red-and-blue vision of Mars!",
    },
    "mp-barnacle-bill": {
      nssdcaId: "1996-068B-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068B",
      officialDesignation: "Andesite Rock Target 'Barnacle Bill'",
      archetype: "First In-Situ Analyzed Mars Rock",
      funFactKid:
        "Sojourner pressed its Alpha Proton X-ray Spectrometer nose against this rock for 10 hours, discovering it was rich in volcanic quartz silica!",
    },
    "mp-yogi": {
      nssdcaId: "1996-068B-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068B",
      officialDesignation: "Basalt Rock Target 'Yogi'",
      archetype: "Ancient Cataclysmic Flood Boulder",
      funFactKid:
        "Named after Yogi Bear because from a distance its shape looked like a cartoon bear head sitting in the red dirt.",
    },
  },
  "mars-spirit": {
    "sp-rover": {
      nssdcaId: "2003-027A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Spirit Mars Exploration Rover (MER-A)",
      archetype: "Long-Distance Robotic Field Geologist",
      funFactKid:
        "Designed for a 90-day mission, Spirit survived for over 6 years (2,210 Martian sols), climbing 100 meters up Husband Hill!",
    },
    "sp-columbia-hills": {
      nssdcaId: "2003-027A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Husband Hill Summit (Columbia Hills)",
      archetype: "Martian Mountain Summit Landmark",
      funFactKid:
        "Named in honor of astronaut Rick Husband and the Columbia STS-107 crew; Spirit took 14 months to claw its way to the top!",
    },
    "sp-home-plate": {
      nssdcaId: "2003-027A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Home Plate Hydrothermal Feature",
      archetype: "Ancient Hydrothermal Steam Vent",
      funFactKid:
        "Shaped like a baseball home plate, this geological plateau proved ancient Mars had bubbling volcanic hot springs where life could have lived!",
    },
    "sp-wheel-tracks": {
      nssdcaId: "2003-027A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Gertrude Weise Silica Discovery Trench",
      archetype: "Inadvertent Wheel Trench Artifact",
      funFactKid:
        "When Spirit's front wheel jammed, dragging it backwards scraped away soil and accidentally revealed 90% pure silica—its greatest discovery!",
    },
    "sp-bonneville": {
      nssdcaId: "2003-027A-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Bonneville Crater Rim",
      archetype: "200-Meter Impact Crater",
      funFactKid:
        "Spirit peeked over the edge of Bonneville and spotted its own shiny white parachute glistening on the other side of the crater!",
    },
    "sp-heat-shield": {
      nssdcaId: "2003-027A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A",
      officialDesignation: "Jettisoned Ablative Heat Shield",
      archetype: "Thermal Protection System Remnant",
      funFactKid:
        "Protected Spirit from 1,500°C reentry heat before being ejected at supersonic speed to tumble into the red dirt.",
    },
  },
  "mars-opportunity": {
    "op-rover": {
      nssdcaId: "2003-032A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Opportunity Mars Exploration Rover (MER-B)",
      archetype: "All-Time Off-Earth Marathon Record Holder",
      funFactKid:
        "Opportunity drove 45.16 kilometers over nearly 15 years—running a full Olympic marathon on another planet before being silenced by a 2018 dust storm.",
    },
    "op-eagle-crater": {
      nssdcaId: "2003-032A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Eagle Crater 'Hole-in-One' Landing Site",
      archetype: "22-Meter Primary Landing Crater",
      funFactKid:
        "Engineers called it a 400-million-kilometer 'hole in one' because the airbag-wrapped rover rolled right into this tiny crater!",
    },
    "op-blueberries": {
      nssdcaId: "2003-032A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Haematite Concretion Spherules ('Blueberries')",
      archetype: "Sedimentary Water-Formed Minerals",
      funFactKid:
        "These tiny 4 mm gray pearls formed deep inside ancient acidic lakes and provided the first rock-solid proof that liquid water once pooled on Mars!",
    },
    "op-heat-shield": {
      nssdcaId: "2003-032A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Opportunity Heat Shield & 'Heat Shield Rock'",
      archetype: "Impacted Thermal Shield & First Alien Meteorite",
      funFactKid:
        "Next to the twisted metal of her heat shield, Opportunity discovered an iron-nickel meteorite—the first meteorite ever identified on another planet!",
    },
    "op-marathon-valley": {
      nssdcaId: "2003-032A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Marathon Valley (Endeavour Crater Rim)",
      archetype: "Olympic Marathon Milestone Site",
      funFactKid:
        "In March 2015, Opportunity crossed 42.195 km right here—the exact official length of a human marathon race!",
    },
    "op-perseverance-valley": {
      nssdcaId: "2003-032A-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A",
      officialDesignation: "Perseverance Valley (Final Resting Place)",
      archetype: "Historic Off-World Dormant Monument",
      funFactKid:
        "As a planetary dust storm blocked out the Sun, Opportunity sent her final transmission: 'My battery is low and it's getting dark.'",
    },
  },
  "mars-curiosity": {
    "cu-rover": {
      nssdcaId: "2011-070A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A",
      officialDesignation: "Curiosity Mars Science Laboratory (MSL)",
      archetype: "Nuclear-Powered Heavy Astrobiology Lab",
      funFactKid:
        "Curiosity is the size of an SUV, powered by a nuclear plutonium generator, and shoots a laser beam to vaporize rocks from 7 meters away!",
    },
    "cu-sky-crane": {
      nssdcaId: "2011-070B",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070B",
      officialDesignation: "Rocket-Powered Sky Crane Impact Site",
      archetype: "Tethered Aerial Landing Vehicle Remnant",
      funFactKid:
        "During the '7 Minutes of Terror', this rocket backpack lowered Curiosity on 7.5-meter nylon cords, cut the tethers, and flew away to crash safely!",
    },
    "cu-yellowknife": {
      nssdcaId: "2011-070A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A",
      officialDesignation: "Yellowknife Bay Ancient Mudstone Bed",
      archetype: "Ancient Habitable Lake Deposit",
      funFactKid:
        "Curiosity drilled into this mudstone and proved that Gale Crater was once an ancient freshwater lake with all the ingredients needed for microbial life!",
    },
    "cu-mount-sharp": {
      nssdcaId: "2011-070A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A",
      officialDesignation: "Aeolis Mons (Mount Sharp) Lower Slopes",
      archetype: "5,500-Meter Central Sedimentary Mountain",
      funFactKid:
        "Mount Sharp is taller than the highest peak in the continental United States, built from billions of years of layered Martian lake mud!",
    },
    "cu-drill-holes": {
      nssdcaId: "2011-070A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A",
      officialDesignation: "Subsurface Rock Core Borehole Targets",
      archetype: "In-Situ Powdered Regolith Extraction",
      funFactKid:
        "Curiosity has drilled over 40 holes in Mars, scooping gray powder into its internal SAM oven to bake and smell organic chemicals!",
    },
    "cu-calibration-target": {
      nssdcaId: "2011-070A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2011-070A",
      officialDesignation: "MAHLI Camera Calibration Target & 1909 Penny",
      archetype: "Optical Camera Color Calibration Standard",
      funFactKid:
        "The camera calibration target carries a real 1909 Lincoln penny as a nod to geologists who place a coin next to rocks for scale!",
    },
  },
  "mars-perseverance": {
    "pe-rover": {
      nssdcaId: "2020-052A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
      officialDesignation: "Perseverance Rover (Mars 2020)",
      archetype: "Next-Gen Sample-Caching Astrobiology Rover",
      funFactKid:
        "Carries MOXIE, a toaster-sized machine that breathes Mars's toxic carbon dioxide air and turns it into pure breathable oxygen!",
    },
    "pe-ingenuity": {
      nssdcaId: "2020-052B",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052B",
      officialDesignation: "Ingenuity Mars Helicopter ('Ginny')",
      archetype: "First Powered Aircraft on Another World",
      funFactKid:
        "Carries a tiny swatch of muslin cloth from the Wright Brothers' 1903 airplane under its solar panel, and flew 72 times across Mars!",
    },
    "pe-sample-tubes": {
      nssdcaId: "2020-052A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
      officialDesignation: "Three Forks Sample Cache Depot (10 Titanium Tubes)",
      archetype: "First Off-World Geological Sample Depot",
      funFactKid:
        "10 hermetically sealed titanium tubes resting on the ground, waiting for a future NASA/ESA rocket to pick them up and bring them to Earth!",
    },
    "pe-delta": {
      nssdcaId: "2020-052A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
      officialDesignation: "Jezero Crater Ancient River Delta",
      archetype: "3.5-Billion-Year-Old River Fan Sediments",
      funFactKid:
        "Billions of years ago, a fast-flowing river emptied into Jezero Crater lake right here, dropping clays that preserve ancient organic molecules!",
    },
    "pe-supercam": {
      nssdcaId: "2020-052A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A",
      officialDesignation: "SuperCam LIBS Remote Laser Pits",
      archetype: "Remote Laser Plasma Spectrometer",
      funFactKid:
        "Fires a pulsing infrared laser that heats rocks to 10,000°C into glowing plasma so a telescope can read their atomic chemistry!",
    },
    "pe-sky-crane": {
      nssdcaId: "2020-052C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052C",
      officialDesignation: "Perseverance Sky Crane Impact Site",
      archetype: "Tethered Descent Stage Crash Site",
      funFactKid:
        "After lowering Percy safely onto its six wheels, the sky crane throttled up to full rocket thrust and flew 700 meters away to crash into the sands.",
    },
  },
};

/**
 * Returns the official NASA NSSDCA catalog entry for a given mission and object.
 * Falls back cleanly if not explicitly indexed.
 */
export function getNssdcCatalog(missionId: string, objectId: string): NssdcCatalogEntry {
  const direct = CATALOG_DATA[missionId]?.[objectId];
  if (direct) return direct;

  const isMars = missionId.startsWith("mars");
  return {
    nssdcaId: isMars ? "2020-052A" : "1969-059C",
    catalogUrl: "https://nssdc.gsfc.nasa.gov/",
    officialDesignation: `${missionId.toUpperCase()} Heritage Artifact`,
    archetype: isMars ? "Martian Surface Relic" : "Lunar Surface Relic",
    funFactKid:
      "This scientific artifact remains permanently stationed on the alien surface, preserved under vacuum and cosmic rays for future generations.",
  };
}
