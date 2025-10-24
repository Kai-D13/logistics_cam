/**
 * Script to geocode destinations using Mapbox Geocoding API
 * and rebuild markers.json from hubs.json and destinations.json
 */

const fs = require('fs');
const path = require('path');

// Mapbox Access Token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2FpZHJvZ2VyIiwiYSI6ImNtaDM4bnB2cjBuN28ybnM5NmV0ZTluZHEifQ.YHW9Erg1h5egssNhthQiZw';

// Paths
const DESTINATIONS_PATH = path.join(__dirname, '..', 'destinations.json');
const HUBS_PATH = path.join(__dirname, '..', 'hubs.json');
const MARKERS_OUTPUT_PATH = path.join(__dirname, '..', 'frontend', 'public', 'markers.json');

// Rate limiting: Mapbox allows 600 requests per minute
const DELAY_MS = 150; // ~400 requests per minute to be safe

/**
 * Geocode an address using Mapbox Geocoding API
 * @param {string} address - Full address to geocode
 * @returns {Promise<{lat: number, long: number} | null>}
 */
async function geocodeAddress(address) {
  try {
    // URL encode the address
    const encodedAddress = encodeURIComponent(address + ', Cambodia');
    
    // Mapbox Geocoding API endpoint
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&country=KH&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { lat: latitude, long: longitude };
    }
    
    console.warn(`⚠️  No results found for: ${address}`);
    return null;
  } catch (error) {
    console.error(`❌ Error geocoding ${address}:`, error.message);
    return null;
  }
}

/**
 * Delay execution
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to geocode all destinations
 */
async function geocodeDestinations() {
  console.log('🚀 Starting geocoding process...\n');
  
  // Read destinations.json
  console.log('📖 Reading destinations.json...');
  const destinations = JSON.parse(fs.readFileSync(DESTINATIONS_PATH, 'utf8'));
  console.log(`✅ Found ${destinations.length} destinations\n`);
  
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  // Process each destination
  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    
    // Skip if already has coordinates
    if (dest.lat && dest.long && !isNaN(dest.lat) && !isNaN(dest.long)) {
      console.log(`⏭️  [${i + 1}/${destinations.length}] Skipping ${dest.name} (already has coordinates)`);
      skippedCount++;
      continue;
    }
    
    console.log(`🔍 [${i + 1}/${destinations.length}] Geocoding: ${dest.address}`);
    
    // Geocode the address
    const coords = await geocodeAddress(dest.address);
    
    if (coords) {
      dest.lat = coords.lat;
      dest.long = coords.long;
      successCount++;
      console.log(`   ✅ Success: ${coords.lat}, ${coords.long}`);
    } else {
      failCount++;
      console.log(`   ❌ Failed to geocode`);
    }
    
    // Rate limiting delay
    if (i < destinations.length - 1) {
      await delay(DELAY_MS);
    }
  }
  
  // Save updated destinations.json
  console.log('\n💾 Saving updated destinations.json...');
  fs.writeFileSync(DESTINATIONS_PATH, JSON.stringify(destinations, null, 2), 'utf8');
  console.log('✅ destinations.json updated!\n');
  
  // Print summary
  console.log('📊 GEOCODING SUMMARY:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   📍 Total: ${destinations.length}\n`);
  
  return destinations;
}

/**
 * Rebuild markers.json from hubs and destinations
 */
function rebuildMarkers(destinations) {
  console.log('🔨 Rebuilding markers.json...\n');
  
  // Read hubs.json
  console.log('📖 Reading hubs.json...');
  const hubs = JSON.parse(fs.readFileSync(HUBS_PATH, 'utf8'));
  console.log(`✅ Found ${hubs.length} hubs\n`);
  
  // Create hub lookup map
  const hubMap = {};
  hubs.forEach(hub => {
    hubMap[hub.id] = hub;
  });
  
  // Build markers array
  const markers = [];
  let invalidCount = 0;
  
  destinations.forEach(dest => {
    // Skip if no coordinates
    if (!dest.lat || !dest.long || isNaN(dest.lat) || isNaN(dest.long)) {
      console.warn(`⚠️  Skipping ${dest.name} - missing coordinates`);
      invalidCount++;
      return;
    }
    
    // Find corresponding hub
    const hub = hubMap[dest.hub_id];
    if (!hub) {
      console.warn(`⚠️  Skipping ${dest.name} - hub not found: ${dest.hub_id}`);
      invalidCount++;
      return;
    }
    
    // Create marker object (old format for compatibility)
    markers.push({
      hub_destination: dest.name,
      address_destination: dest.address,
      hub_departer: hub.name,
      order: dest.orders_per_month,
      destination_lat: dest.lat,
      destination_long: dest.long,
      departer_lat: hub.lat,
      departer_long: hub.long
    });
  });
  
  // Save markers.json
  console.log(`💾 Saving markers.json (${markers.length} markers)...`);
  fs.writeFileSync(MARKERS_OUTPUT_PATH, JSON.stringify(markers, null, 2), 'utf8');
  console.log('✅ markers.json created!\n');
  
  // Print summary
  console.log('📊 MARKERS SUMMARY:');
  console.log(`   ✅ Valid markers: ${markers.length}`);
  console.log(`   ⚠️  Invalid/skipped: ${invalidCount}`);
  console.log(`   📍 Total destinations: ${destinations.length}\n`);
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🗺️  MAPBOX GEOCODING & MARKERS REBUILD SCRIPT');
  console.log('═══════════════════════════════════════════════════════\n');
  
  try {
    // Step 1: Geocode destinations
    const destinations = await geocodeDestinations();
    
    // Step 2: Rebuild markers
    rebuildMarkers(destinations);
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅ ALL DONE! 🎉');
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();

