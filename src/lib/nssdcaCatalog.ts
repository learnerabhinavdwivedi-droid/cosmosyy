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

export const CATALOG_DATA: Record<string, Record<string, NssdcCatalogEntry>> = {
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
  "mars-viking2": {
    "v2-lander-body": {
      nssdcaId: "1975-083C",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Viking 2 Lander",
      archetype: "Titanium Inverted-Tripod Mars Lander",
      funFactKid:
        "Touched down on Utopia Planitia in September 1976 and returned the first close-up images of Martian frost on the ground!",
    },
    "v2-sampler-arm": {
      nssdcaId: "1975-083C-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Surface Sampler Collector Arm",
      archetype: "3-Meter Articulated Soil Backhoe",
      funFactKid:
        "Pushed aside a rock nicknamed 'Mr. Badger' to scoop protected soil that had never seen sunlight for millions of years!",
    },
    "v2-seismometer": {
      nssdcaId: "1975-083C-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Viking 2 Seismometer",
      archetype: "Three-Axis Subsurface Seismograph",
      funFactKid:
        "Unlike Viking 1, its locking pin opened perfectly, recording what scientists believe was the first-ever detected marsquake!",
    },
    "v2-meteorology": {
      nssdcaId: "1975-083C-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Meteorology Sensor Boom",
      archetype: "Atmospheric Weather Telemetry Station",
      funFactKid:
        "Recorded subzero temperatures as low as -120°C and proved that the Martian atmospheric pressure changes as polar caps freeze and thaw.",
    },
    "v2-facsimile-camera": {
      nssdcaId: "1975-083C-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Dual Facsimile Stereo Camera Pair",
      archetype: "Vertical Scanning Mirror Stereoscopic Camera",
      funFactKid:
        "Built panoramic images strip by strip with oscillating mirrors, revealing a rock-strewn plain covered in winter water-ice frost.",
    },
    "v2-gcms-inlet": {
      nssdcaId: "1975-083C-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C",
      officialDesignation: "Gas Chromatograph Mass Spectrometer (GCMS)",
      archetype: "Organic Pyrolysis & Molecular Analyzer",
      funFactKid:
        "Heated soil samples to 500°C to sniff for organic carbon molecules in Utopia Planitia.",
    },
  },
  "mars-phoenix": {
    "phoenix-lander-body": {
      nssdcaId: "2007-034A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Phoenix Mars Lander",
      archetype: "Arctic Tundra Pulsed-Hydrazine Soft Lander",
      funFactKid:
        "Landed near the Martian north pole in May 2008 and became the first spacecraft to directly touch and taste water ice on Mars!",
    },
    "phoenix-ra-arm": {
      nssdcaId: "2007-034A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Robotic Arm (RA) & Motorized Rasp",
      archetype: "2.35-Meter Titanium Cryo-Trenching Arm",
      funFactKid:
        "Scraped away topsoil in the 'Snow White' trench to expose gleaming white water-ice dice that evaporated over 4 days!",
    },
    "phoenix-tega": {
      nssdcaId: "2007-034A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Thermal and Evolved-Gas Analyzer (TEGA)",
      archetype: "Eight-Cell Miniature High-Temp Pyrolysis Oven",
      funFactKid:
        "Baked ice-rich soil to 1,000°C inside eight single-use tiny ovens to identify trapped water vapor and carbon dioxide.",
    },
    "phoenix-meca": {
      nssdcaId: "2007-034A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Microscopy, Electrochemistry, and Conductivity Analyzer (MECA)",
      archetype: "Atomic Force Wet Chemical Laboratory",
      funFactKid:
        "Dissolved Martian dirt in Earth water beakers and discovered perchlorate salts, revealing that Martian Arctic soil has a slightly alkaline pH.",
    },
    "phoenix-solar-wings": {
      nssdcaId: "2007-034A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Dual Decagonal Bio-Solar Arrays",
      archetype: "Circular Origami Foldable Solar Wings",
      funFactKid:
        "Unfurled like Japanese paper fans into twin 2.1-meter circles to catch low polar sunlight until the deep Martian winter froze them.",
    },
    "phoenix-lidar": {
      nssdcaId: "2007-034A-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-034A",
      officialDesignation: "Meteorological Station (MET) Laser LiDAR",
      archetype: "Atmospheric Laser Remote Sensor",
      funFactKid:
        "Shot green laser beams into the Arctic clouds and detected genuine snowflakes falling from Martian clouds 4 km high!",
    },
  },
  "mars-insight": {
    "insight-lander-body": {
      nssdcaId: "2018-042A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "InSight Lander (Interior Exploration using Seismic Investigations)",
      archetype: "Geophysical Planetary Core Observatory",
      funFactKid:
        "Sat in Elysium Planitia for 4 years acting as Mars's doctor, taking its pulse (seismology), temperature (heat probe), and reflexes.",
    },
    "insight-seis": {
      nssdcaId: "2018-042A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "Seismic Experiment for Interior Structure (SEIS)",
      archetype: "Vacuum-Sealed Ultra-Sensitive Seismometer",
      funFactKid:
        "Placed directly on the ground under a protective dome, SEIS detected over 1,300 marsquakes and mapped Mars's crust, mantle, and molten core!",
    },
    "insight-hp3": {
      nssdcaId: "2018-042A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "Heat Flow and Physical Properties Package (HP³ 'The Mole')",
      archetype: "Self-Hammering Thermal Penetrometer",
      funFactKid:
        "A robotic hammering spike that hammered thousands of times to measure the heat escaping from the ancient core of Mars.",
    },
    "insight-ultraflex": {
      nssdcaId: "2018-042A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "UltraFlex Decagonal Solar Array Pair",
      archetype: "Dual 2.15-Meter Lightweight Solar Panels",
      funFactKid:
        "Generated enough power to run a blender when clean, but thick Martian dust finally blanketed the panels in December 2022 after 4 historic years.",
    },
    "insight-idc-arm": {
      nssdcaId: "2018-042A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "Instrument Deployment Arm (IDA) & Camera (IDC)",
      archetype: "Four-Degree-of-Freedom Robotic Grapple Arm",
      funFactKid:
        "Gently gripped the SEIS seismometer with its claw and placed it millimeter-accurately on the Martian dirt—the first robotic placement of its kind!",
    },
    "insight-twins": {
      nssdcaId: "2018-042A-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A",
      officialDesignation: "Temperature and Wind for InSight (TWINS)",
      archetype: "Environmental Surface Weather Station",
      funFactKid:
        "Tracked hundreds of dust devils whirling across Elysium Planitia, measuring sudden air pressure drops as they passed over the lander.",
    },
  },
  "deep-dawn": {
    "dawn-spacecraft": {
      nssdcaId: "2007-043A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A",
      officialDesignation: "Dawn Spacecraft",
      archetype: "Main Asteroid Belt Interplanetary Explorer",
      funFactKid:
        "The only spacecraft to orbit two different extraterrestrial bodies: giant asteroid Vesta (2011) and dwarf planet Ceres (2015)!",
    },
    "cerealia-facula": {
      nssdcaId: "2007-043A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A",
      officialDesignation: "Cerealia Facula Bright Sodium Carbonate Deposit",
      archetype: "Occator Crater Hydrothermal Brine Dome",
      funFactKid:
        "A luminous bright spot in Occator Crater formed by ancient briny water erupting from a subterranean reservoir and leaving gleaming salt deposits!",
    },
    "grand-sensor": {
      nssdcaId: "2007-043A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A",
      officialDesignation: "Gamma Ray and Neutron Detector (GRaND)",
      archetype: "Cosmic Ray Spectroscopy Instrument",
      funFactKid:
        "Discovered that water ice makes up roughly 10% to 30% of Ceres' upper regolith by weight, proving Ceres is a giant ice-rock world rather than a dead asteroid!",
    },
    "dawn-ion-engine": {
      nssdcaId: "2007-043A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2007-043A",
      officialDesignation: "NSTAR Xenon Ion Propulsion System",
      archetype: "Electrostatic Xenon Ion Thruster Trio",
      funFactKid:
        "Fired a glowing blue xenon plasma beam with thrust equal to the weight of a single piece of paper, firing continuously for over 5 years!",
    },
  },
  "deep-near": {
    "near-spacecraft": {
      nssdcaId: "1996-008A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A",
      officialDesignation: "NEAR Shoemaker Spacecraft",
      archetype: "First Asteroid Orbiter & Soft-Lander",
      funFactKid:
        "Orbited asteroid 433 Eros for a year, then on February 12, 2001, gently touched down on its surface at 4 mph—transmitting signals for 16 days after landing!",
    },
    "xgrs-spectrometer": {
      nssdcaId: "1996-008A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A",
      officialDesignation: "X-ray / Gamma-Ray Spectrometer (XGRS)",
      archetype: "Orbital Asteroid Elemental Composition Scanner",
      funFactKid:
        "Proved that Eros is an undifferentiated primitive asteroid made of ordinary chondrite material that hasn't changed since the birth of our solar system!",
    },
    "near-solar-wings": {
      nssdcaId: "1996-008A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A",
      officialDesignation: "Fixed Gallium Arsenide Solar Arrays",
      archetype: "Four-Panel Asteroid Orbit Power Array",
      funFactKid:
        "Generated 1,800 watts of power in the asteroid belt and survived touching the gravelly boulder-strewn surface of Eros completely intact.",
    },
    "eros-ponded-regolith": {
      nssdcaId: "1996-008A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-008A",
      officialDesignation: "Eros Ponded Regolith Dust Deposits",
      archetype: "Electrostatic Micro-Dust Settling Feature",
      funFactKid:
        "Smooth, flat ponds of fine dust nestled inside craters, likely formed when electrostatic levitation caused tiny particles to drift and settle like liquid!",
    },
  },
  "deep-kepler": {
    "kepler-telescope": {
      nssdcaId: "2009-011A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A",
      officialDesignation: "Kepler Space Observatory",
      archetype: "0.95-Meter Schmidt Exoplanet Photometer",
      funFactKid:
        "Stared unblinkingly at 150,000 stars in Cygnus for 9 years and discovered over 2,600 confirmed exoplanets, proving planets outnumber stars in our galaxy!",
    },
    "ccd-focal-plane": {
      nssdcaId: "2009-011A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A",
      officialDesignation: "42-CCD 95-Megapixel Curved Focal Plane",
      archetype: "High-Precision Stellar Photometric Array",
      funFactKid:
        "The largest camera ever launched into space at the time, so sensitive it could detect a flea crawling across a car headlight hundreds of miles away!",
    },
    "reaction-wheel-assembly": {
      nssdcaId: "2009-011A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A",
      officialDesignation: "Precision Reaction Wheel Gyroscopic Stabilizers",
      archetype: "High-Momentum Orientation Flywheels",
      funFactKid:
        "When two reaction wheels broke, engineers balanced sunlight pressure on the spacecraft's solar body as a virtual third wheel to launch the K2 mission!",
    },
    "photometer-sunshield": {
      nssdcaId: "2009-011A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2009-011A",
      officialDesignation: "Integrated Solar Array & Thermal Sunshade",
      archetype: "Light Baffle & Heliocentric Thermal Shield",
      funFactKid:
        "Shaded the optical telescope from stray sunlight so its cryogenic photometer stayed cold and stable in its trailing orbit around the Sun.",
    },
  },
  "deepspace-pioneer": {
    "pioneer-dish": {
      nssdcaId: "1972-012A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "Pioneer 10 & 11 2.74-Meter High-Gain Antenna (Pioneer 10: 1972-012A / Pioneer 11: 1973-019A)",
      archetype: "Spin-Stabilized Deep Space Parabolic Dish",
      funFactKid:
        "Pioneer 10's dish transmitted its last whisper from 12 billion km in 2003; its twin Pioneer 11 last signaled in 1995!",
    },
    "pioneer-rtg-booms": {
      nssdcaId: "1972-012A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "SNAP-19 Radioisotope Thermoelectric Generators",
      archetype: "Extended Deployable Nuclear Power Booms",
      funFactKid:
        "Extended on 3-meter booms to keep radiation away from scientific instruments, powered by decaying plutonium-238 pellets for over 30 years.",
    },
    "pioneer-plaque": {
      nssdcaId: "1972-012A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "The Pioneer Golden Plaque (Pioneer 10 & 11)",
      archetype: "Interstellar Message Plaque to Extraterrestrial Life",
      funFactKid:
        "Gold-anodized aluminum plaques designed by Carl Sagan and Frank Drake showing human figures, our solar system, and a map of 14 pulsars locating Earth!",
    },
    "pioneer-plasma-analyzer": {
      nssdcaId: "1972-012A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "Quadraspherical Solar Wind Plasma Analyzer",
      archetype: "Charged Particle Electrostatic Deflector",
      funFactKid:
        "Made the first direct measurements of the solar wind expanding all the way out past Jupiter and Saturn toward the heliopause.",
    },
    "pioneer-magnetometer-boom": {
      nssdcaId: "1972-012A-04",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "Helium Vector Magnetometer (HVM)",
      archetype: "6.6-Meter Lightweight Fiberglass Magnetometer Mast",
      funFactKid:
        "Discovered that Jupiter's magnetic field is enormous—millions of times larger than Earth's, enclosing radiation belts thousands of times deadlier!",
    },
    "pioneer-interstellar-dust": {
      nssdcaId: "1972-012A-05",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A",
      officialDesignation: "Meteoroid Detector & Cosmic Ray Telescope",
      archetype: "Pressurized Cell Micrometeorite Impact Sensor",
      funFactKid:
        "Proved in 1972 that spacecraft could safely travel straight through the Asteroid Belt without being destroyed by cosmic space debris!",
    },
  },
  "deep-voyager": {
    "voyager-probe": {
      nssdcaId: "1977-084A",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1977-084A",
      officialDesignation: "Voyager 1 Interstellar Spacecraft",
      archetype: "Interstellar Boundary Explorer & Probe",
      funFactKid:
        "The farthest human-made object in history—launched in 1977, entered interstellar space in 2012, and is now over 15 billion miles from Earth!",
    },
    "golden-record": {
      nssdcaId: "1977-084A-01",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1977-084A",
      officialDesignation: "The Golden Record (Voyager 1 & 2)",
      archetype: "12-Inch Gold-Plated Copper Phonograph Disc",
      funFactKid:
        "Carries 115 pictures, sounds of thunder and birds, greetings in 55 languages, and music by Bach, Beethoven, and Chuck Berry for any alien who finds it!",
    },
    "rtg-power-boom": {
      nssdcaId: "1977-084A-02",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1977-084A",
      officialDesignation: "MHW-RTG Nuclear Power Boom",
      archetype: "Three SNAP-19/MHW Nuclear Thermal Generator Boom",
      funFactKid:
        "Still produces electrical warmth in the -455°F deep space freeze from glowing pellets of plutonium, powering Voyager's computers for nearly 50 years!",
    },
    "plasma-wave-antenna": {
      nssdcaId: "1977-084A-03",
      catalogUrl: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1977-084A",
      officialDesignation: "Plasma Wave Subsystem (PWS) 10-Meter Dipole",
      archetype: "V-Shaped Beryllium-Copper Radio Dipole",
      funFactKid:
        "Recorded the eerie, whistling sound of interstellar space vibrating when Voyager 1 crossed beyond our Sun's protective heliosphere bubble in 2012!",
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
  const isDeep = missionId.startsWith("deep-") || missionId.startsWith("deepspace-");
  return {
    nssdcaId: isMars ? "2020-052A" : isDeep ? "1977-084A" : "1969-059C",
    catalogUrl: "https://nssdc.gsfc.nasa.gov/",
    officialDesignation: `${missionId.toUpperCase()} Heritage Artifact`,
    archetype: isMars
      ? "Martian Surface Relic"
      : isDeep
        ? "Deep Space Interstellar Artifact"
        : "Lunar Surface Relic",
    funFactKid: isDeep
      ? "This spacecraft or probe is preserved in deep space or on a distant asteroid, voyaging eternally through the solar system."
      : "This scientific artifact remains permanently stationed on the alien surface, preserved under vacuum and cosmic rays for future generations.",
  };
}
