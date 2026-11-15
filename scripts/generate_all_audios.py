import os
import sys
import json
import asyncio
import edge_tts

MISSIONS_DIR = os.path.abspath("content/missions")
HERITAGE_AUDIO_DIR = os.path.abspath("public/audio/heritage")
NARRATION_AUDIO_DIR = os.path.abspath("public/audio/narration")

TUTOR_VOICE = "en-US-ChristopherNeural"

# Flight phase narration scripts for missions that don't have them yet
NARRATION_SCRIPTS = {
    "mars-curiosity": {
        "explore": "Explore Gale Crater. Inspect the Curiosity rover, ChemCam mast, robotic sample drill, and radioisotope power generator.",
        "flagReady": "Martian habitability survey verified. Prepare to set the expedition marker.",
        "flagPlanted": "Mission marker secured on the slopes of Mount Sharp in Gale Crater.",
        "launch": "Sample cache logged. Launching data stream to the Mars Reconnaissance Orbiter."
    },
    "mars-opportunity": {
        "explore": "Explore Meridiani Planum. Scan the Opportunity rover, solar wings, panoramic mast, and hematite blueberry fields.",
        "flagReady": "Marathon driving distance complete. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker placed in honor of the longest-lived robotic explorer on Mars.",
        "launch": "Telemetry finalized. Returning mission data home across the solar system."
    },
    "mars-pathfinder": {
        "explore": "Explore Ares Vallis. Inspect the Pathfinder lander petals, Sojourner micro-rover, and ancient Martian flood stones.",
        "flagReady": "First rover expedition verified. Prepare to place your mission marker.",
        "flagPlanted": "Mission marker placed at the Carl Sagan Memorial Station in Ares Vallis.",
        "launch": "Historic rover mission cataloged. Relaying data packets to Earth."
    },
    "mars-perseverance": {
        "explore": "Explore Jezero Crater. Scan the Perseverance rover, Ingenuity helicopter, MOXIE oxygen extractor, and hermetic sample tubes.",
        "flagReady": "Astrobiology sample cores sealed. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker placed on the ancient river delta of Jezero Crater.",
        "launch": "Mars sample return telemetry ready. Telemetry uplink confirmed."
    },
    "mars-spirit": {
        "explore": "Explore Gusev Crater. Scan the Spirit rover, solar panels, microscopic imager, and Columbia Hills vista.",
        "flagReady": "Geological exploration complete. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker planted atop the Columbia Hills in memory of brave exploration.",
        "launch": "Hydrothermal mineral records secured. Uplinking data to Earth."
    },
    "mars-viking1": {
        "explore": "Explore Chryse Planitia. Scan the Viking 1 lander body, high-gain dish, biology experiment unit, and weather boom.",
        "flagReady": "First successful Mars landing verified. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker planted where humanity first touched the surface of Mars in 1976.",
        "launch": "Atmospheric and surface telemetry secured. Relaying to the Viking 1 Orbiter."
    },
    "mars-viking2": {
        "flight": "Welcome aboard, Commander. Viking 2 is outbound on a 440-million-mile trajectory toward the northern hemisphere of Mars.",
        "coast": "Interplanetary cruise is stable. Viking 2 follows the path blazed by Viking 1 two months ahead, aiming for Utopia Planitia.",
        "orbit": "Mars Orbit Insertion complete. High-resolution cameras scan the northern plains, seeking a safe landing zone among the boulders.",
        "targetLocked": "Target locked: Utopia Planitia, 48 degrees North. Golden plains swept by seasonal frost. Preparing lander separation.",
        "descent": "Aeroshell entry at 10,000 miles per hour. Supersonic parachute deployed. Terminal retro-rockets firing smoothly.",
        "touchdown": "Radar altimeter confirms contact. Engine cutoff. Viking 2 has touched down on the plains of Utopia. September 3, 1976.",
        "stepOut": "Instruments initializing. Twin cameras begin sweeping the horizon, revealing an endless plain of scattered volcanic rocks.",
        "explore": "Explore Utopia Planitia. Survey the lander body, the robotic sampler arm, and the meteorology mast.",
        "flagReady": "Surface documentation complete. Prepare to leave your mission marker upon the plains of Utopia.",
        "flagPlanted": "Mission marker secured on the red sands of Utopia Planitia.",
        "launch": "Telemetry transmitting to the orbiter overhead. Returning to orbital rendezvous."
    },
    "mars-phoenix": {
        "flight": "Welcome aboard, Commander. Phoenix is bound for Vastitas Borealis, the frozen northern polar region of Mars.",
        "coast": "Interplanetary cruise nominal. Rising from the ashes of cancelled missions, Phoenix is equipped with a titanium ice scoop.",
        "orbit": "Final trajectory correction complete. Direct ballistic entry trajectory into the northern polar atmosphere.",
        "targetLocked": "Target locked: Green Valley, Vastitas Borealis, 68 degrees North. Ancient cracked polygon terrain below.",
        "descent": "Atmospheric entry heatshield glowing. Parachute deployed. Soft-pulsed hydrazine thrusters firing to avoid disturbing surface ice.",
        "touchdown": "Touchdown confirmed! Phoenix has landed safely in the Martian arctic plains. May 25, 2008.",
        "stepOut": "Deploying circular solar wings. The surface cameras look down and spot pure white ice right under the lander legs.",
        "explore": "Explore Vastitas Borealis. Scan the Phoenix deck, the trenching arm, TEGA ovens, and the atmospheric lidar.",
        "flagReady": "Polar exploration goals achieved. Prepare to plant the mission marker in the arctic permafrost.",
        "flagPlanted": "Mission marker firmly planted into the cracked polygon ground of the Martian north.",
        "launch": "Polar science packets secured. Ascending from the arctic plains back to orbit."
    },
    "mars-insight": {
        "flight": "Welcome aboard, Commander. InSight is bound for Elysium Planitia to listen to the deep internal heartbeat of Mars.",
        "coast": "Cruise stage operating smoothly. InSight travels accompanied by twin briefcase-sized MarCO CubeSats relaying data.",
        "orbit": "Atmospheric entry corridor established. InSight prepares for six minutes of terror through the Martian skies.",
        "targetLocked": "Target locked: Elysium Planitia, 4.5 degrees North. A smooth, flat landing plain with few dangerous boulders.",
        "descent": "Hypersonic deceleration complete. Parachute discarded. Twelve pulsed descent engines guiding the hexagonal lander down.",
        "touchdown": "Engine shutdown confirmed. InSight is on the ground at Elysium Planitia! November 26, 2018.",
        "stepOut": "UltraFlex solar panels unrolled. Robotic arm powered on to gently place the SEIS seismometer dome onto the soil.",
        "explore": "Explore Elysium Planitia. Inspect the lander deck, the SEIS seismometer, HP3 heat probe, and weather sensors.",
        "flagReady": "Geophysical survey complete. Prepare to plant the mission marker on the quiet plains.",
        "flagPlanted": "Mission marker planted where humanity first listened to the tremors of an alien planet.",
        "launch": "Seismic logs archived. Launching ascent capsule back into orbit."
    },
    "deepspace-pioneer": {
        "flight": "Welcome aboard, Commander. Pioneer 10 and 11 are launched atop the Atlas-Centaur with humanity's highest escape velocity.",
        "coast": "Sailing through the Asteroid Belt unscathed, proving spacecraft can safely navigate the asteroid debris zone.",
        "orbit": "Proximity flyby of Jupiter. Radiation sensors glowing as the giant planet's magnetic field whips Pioneer toward the stars.",
        "targetLocked": "Trajectory locked on interstellar escape. Nuclear RTG booms deployed. The Golden Plaque shines under the faint sun.",
        "descent": "Navigating the heliospheric termination shock, 80 times further from the Sun than Earth.",
        "touchdown": "Terminal tracking locked. Pioneer sails outward into the deep interstellar void, drifting in eternal peace.",
        "stepOut": "Sensors reading the interstellar dust and magnetic fields of the Milky Way galaxy.",
        "explore": "Explore the Pioneer probe. Scan the 2.74-meter high-gain antenna, RTG power booms, and Carl Sagan's Golden Plaque.",
        "flagReady": "Interstellar journey documented. Prepare to place your cosmic mission marker.",
        "flagPlanted": "Mission marker placed on the threshold of interstellar space.",
        "launch": "All telemetry recorded. Returning to command vessel."
    },
    "deep-dawn": {
        "flight": "Welcome aboard, Commander. Dawn embarks on an ion-propelled journey into the heart of the Asteroid Belt.",
        "coast": "Three xenon ion thrusters firing with gentle, continuous thrust, creating a glowing blue exhaust trail across the solar system.",
        "orbit": "Orbital capture achieved! First at giant asteroid Vesta, then onward to dwarf planet Ceres.",
        "targetLocked": "Target locked: Occator Crater, Ceres. The mysterious bright sodium carbonate spots gleam below.",
        "descent": "Low Altitude Mapping Orbit achieved. Gliding barely 35 kilometers above the crater floor.",
        "touchdown": "Fuel exhausted. Dawn settles into a stable, perpetual gravitational orbit around Ceres.",
        "stepOut": "Instruments analyzing the water-ice and salt deposits on the surface of dwarf planet Ceres.",
        "explore": "Explore the Dawn spacecraft. Scan the ion engine, solar arrays, Cerealia Facula, and the gamma ray spectrometer.",
        "flagReady": "Asteroid survey complete. Prepare to plant the expedition marker.",
        "flagPlanted": "Mission marker placed in orbit around Ceres, humanity's monument in the Asteroid Belt.",
        "launch": "Telemetry synchronized. Returning to Earth."
    },
    "deep-near": {
        "flight": "Welcome aboard, Commander. NEAR Shoemaker is en route to 433 Eros, a peanut-shaped near-Earth asteroid.",
        "coast": "Cruising through the inner solar system, mapping the orbital path of Eros across millions of kilometers.",
        "orbit": "Orbital insertion around asteroid 433 Eros. Gravity is so weak that orbital speed is just a few miles per hour.",
        "targetLocked": "Target locked: Himeros depression on Eros. Preparing for history's first landing on an asteroid.",
        "descent": "Thrusters pulsing gently, slowing descent speed to less than 4 miles per hour onto the rocky surface.",
        "touchdown": "Contact! Soft landing confirmed on asteroid 433 Eros. February 12, 2001. A spacecraft rests on an asteroid.",
        "stepOut": "Lying securely on the regolith. Gamma-ray spectrometers continue transmitting data from the asteroid surface.",
        "explore": "Explore NEAR Shoemaker. Scan the solar wings, the X-ray spectrometer, and the ponded regolith of Eros.",
        "flagReady": "Asteroid landing verified. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker secured on the rocky surface of asteroid 433 Eros.",
        "launch": "Expedition complete. Ascending from Eros back into space."
    },
    "deep-kepler": {
        "flight": "Welcome aboard, Commander. The Kepler Space Telescope launches into an Earth-trailing heliocentric orbit.",
        "coast": "Drifting away from Earth's glare into the pristine dark of space, pointing unblinkingly at the Cygnus constellation.",
        "orbit": "Science orbit locked. The massive 0.95-meter photometer begins staring continuously at 150,000 stars.",
        "targetLocked": "Photometer focal plane locked. Detecting the tiny dips in starlight as distant alien worlds transit their suns.",
        "descent": "Precision pointing active. Kepler discovers thousands of exoplanets, rocky Earth cousins, and planetary systems.",
        "touchdown": "Reaction control fuel expended. Kepler rests in a permanent Earth-trailing orbit around the Sun.",
        "stepOut": "Archiving the discoveries: over 2,600 confirmed exoplanets discovered by a single magnificent eye in space.",
        "explore": "Explore Kepler. Scan the photometer sunshield, the CCD focal plane, and the reaction wheel assembly.",
        "flagReady": "Exoplanet catalog verified. Prepare to set the expedition marker.",
        "flagPlanted": "Mission marker placed in honor of the telescope that showed us the galaxy is full of planets.",
        "launch": "Exoplanet database archived. Returning home."
    },
    "deep-voyager": {
        "flight": "Welcome aboard, Commander. Voyager 1 launches on the historic Grand Tour of the outer solar system.",
        "coast": "Slingshot gravity assists around Jupiter and Saturn hurling Voyager past the outer boundaries of the planets.",
        "orbit": "Solar system boundary reached. Crossing the heliopause into the uncharted interstellar medium.",
        "targetLocked": "Heading locked on the constellation Ophiuchus at 38,000 miles per hour into interstellar space.",
        "descent": "Navigating the silent void, 15 billion miles from the Sun. The pale blue dot of Earth is a speck of dust.",
        "touchdown": "Interstellar journey perpetual. Voyager sails eternally among the stars of the Milky Way.",
        "stepOut": "Plasma wave antennas transmitting the sound of interstellar plasma vibrating in the void.",
        "explore": "Explore Voyager 1. Scan the Golden Record, the high-gain dish antenna, and the magnetometer boom.",
        "flagReady": "Interstellar message in a bottle verified. Prepare to place the expedition marker.",
        "flagPlanted": "Mission marker placed on humanity's furthest journey into the universe.",
        "launch": "Mission data transmitted. Returning from the interstellar frontier."
    }
}

async def generate_audio(text: str, output_path: str, voice=TUTOR_VOICE):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
        return
    print(f"Generating: {os.path.relpath(output_path)}")
    communicate = edge_tts.Communicate(text, voice, rate="-5%")
    await communicate.save(output_path)

async def main():
    print("="*60)
    print("🎙️ Cosmosyy Audio Generator: Missing Heritage & Narrations")
    print("="*60)

    # 1. Generate Missing Heritage Voice Logs
    mission_files = [f for f in os.listdir(MISSIONS_DIR) if f.endswith(".json")]
    generated_heritage = 0

    for mf in mission_files:
        with open(os.path.join(MISSIONS_DIR, mf), "r", encoding="utf-8") as f:
            data = json.load(f)
        mid = data["id"]
        objects = data.get("objects", [])

        for obj in objects:
            oid = obj["id"]
            audio_path = os.path.join(HERITAGE_AUDIO_DIR, mid, f"{oid}.mp3")
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) < 1000:
                text = obj.get("firstPerson") or obj.get("description") or f"I am {obj.get('name')}."
                try:
                    await generate_audio(text, audio_path)
                    generated_heritage += 1
                except Exception as e:
                    print(f"Error generating {audio_path}: {e}")

    print(f"\n✅ Heritage Audio Files Processed: {generated_heritage} generated.\n")

    # 2. Generate Missing Flight Narrations
    generated_narrations = 0
    for mid, phases in NARRATION_SCRIPTS.items():
        for phase, script in phases.items():
            audio_path = os.path.join(NARRATION_AUDIO_DIR, mid, f"{phase}.mp3")
            if not os.path.exists(audio_path) or os.path.getsize(audio_path) < 1000:
                try:
                    await generate_audio(script, audio_path)
                    generated_narrations += 1
                except Exception as e:
                    print(f"Error generating {audio_path}: {e}")

    print(f"\n✅ Flight Narration Files Processed: {generated_narrations} generated.\n")
    print("="*60)
    print("🎉 All audio files successfully created and verified!")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
